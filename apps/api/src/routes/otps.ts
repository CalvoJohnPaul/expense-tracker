import {
	FailedHttpResponseDefinition,
	GenerateOtpInputDefinition,
	VoidSuccessfulHttpResponseDefinition,
} from '@expense-tracker/defs';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import fs from 'node:fs';
import path from 'node:path';
import {uid} from 'uid';
import * as z from 'zod';
import {mailto} from '../helpers/mailto';

const template = fs.readFileSync(path.resolve(__dirname, '../templates/emails/otp.html'), 'utf-8');

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/',
		{
			schema: {
				tags: ['Otp'],
				body: GenerateOtpInputDefinition,
				response: {
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					500: FailedHttpResponseDefinition,
					201: VoidSuccessfulHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const {email} = req.body;

			const registered = await app.prisma.account.exists({email});

			if (!registered) return reply.unauthorized();

			const oneMinuteAgo = new Date();
			oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

			const coolingDown = await app.prisma.otp.exists({
				email,
				createdAt: {
					gte: oneMinuteAgo,
					lte: new Date(),
				},
			});

			if (coolingDown) return reply.badRequest();

			const code = uid(6).toUpperCase();
			const expiresAt = new Date();
			expiresAt.setMinutes(expiresAt.getMinutes() + 10);

			try {
				await app.prisma.otp.upsert({
					where: {
						email,
					},
					create: {
						code,
						email,
						expiresAt,
					},
					update: {
						code,
						expiresAt,
					},
					select: {
						id: true,
					},
				});

				const sent = await mailto({
					recipient: email,
					subject: 'Expense Tracker OTP',
					html: template
						.replace('{{OTP_CODE}}', code)
						.replace('{{CURRENT_YEAR}}', new Date().getFullYear().toString()),
				});

				if (!sent) {
					await app.prisma.otp
						.delete({
							where: {
								email,
							},
						})
						.catch((error) => {
							app.log.error({error, email}, 'Failed to delete OTP after mail failure');
						});

					return reply.internalServerError();
				}
			} catch {
				return reply.internalServerError();
			}

			return reply.code(201).send({ok: true});
		},
	);
};

export const autoPrefix = '/otps';
export default plugin;

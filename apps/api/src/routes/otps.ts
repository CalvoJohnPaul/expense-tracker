import {
	FailedHttpResponseDefinition,
	GenerateOtpDefinition,
	VoidSuccessfulHttpResponseDefinition,
} from '@expense-tracker/defs';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {uid} from 'uid';
import * as z from 'zod';

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/',
		{
			schema: {
				tags: ['Otp'],
				body: GenerateOtpDefinition,
				response: {
					201: VoidSuccessfulHttpResponseDefinition,
					400: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const {email, ttl} = req.body;

			const fiveMinutesAgo = new Date();
			fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

			const coolingDown = await app.prisma.otp.exists({
				email,
				createdAt: {
					gte: fiveMinutesAgo,
					lte: new Date(),
				},
			});

			if (coolingDown) return reply.badRequest();

			const code = uid(6);
			const expiresAt = new Date();
			expiresAt.setSeconds(expiresAt.getSeconds() + ttl);

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

			return reply.send({
				ok: true,
			});
		},
	);
};

export const autoPrefix = '/otps';
export default plugin;

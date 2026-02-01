import {
	CreateSessionInputDefinition,
	FailedHttpResponseDefinition,
	VoidSuccessfulHttpResponseDefinition,
} from '@expense-tracker/defs';
import {compare} from 'bcrypt';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import * as z from 'zod';

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/sessions',
		{
			onRequest: [app.csrfProtection],
			schema: {
				tags: ['Session'],
				body: CreateSessionInputDefinition,
				response: {
					201: VoidSuccessfulHttpResponseDefinition,
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const account = await app.prisma.account.findUnique({
				where: {
					email: req.body.email,
				},
				select: {
					id: true,
					type: true,
					status: true,
					password: true,
				},
			});

			const exists = account && (await compare(req.body.password, account.password));

			if (!exists) return reply.unauthorized('Account not found');

			if (account.status === 'SUSPENDED') return reply.unauthorized('Account is suspended');

			req.session.set('account', account.id);

			if (account.type === 'ADMIN') {
				await app.prisma.adminActivity.create({
					data: {
						type: 'LOG_IN',
						accountId: account.id,
						details: {},
					},
					select: {
						id: true,
					},
				});
			}

			return reply.code(201).send({ok: true});
		},
	);

	app.delete(
		'/session',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyAuth],
			schema: {
				tags: ['Session'],
				response: {
					200: VoidSuccessfulHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			req.session.delete();
			return reply.send({ok: true});
		},
	);
};

export default plugin;

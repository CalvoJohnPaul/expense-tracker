import {
	AccountDefinition,
	ChangePasswordInputDefinition,
	CreateAccountInputDefinition,
	FailedHttpResponseDefinition,
	ResetPasswordInputDefinition,
	SuccessfulHttpResponseDefinition,
	UpdateAccountDataInputDefinition,
	VoidSuccessfulHttpResponseDefinition,
} from '@expense-tracker/defs';
import {compare, hash} from 'bcrypt';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import * as z from 'zod';

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/me',
		{
			schema: {
				tags: ['Account'],
				response: {
					200: SuccessfulHttpResponseDefinition(AccountDefinition.nullable()),
				},
			},
		},
		async (req, reply) => {
			const id = req.session.get('account');

			const data =
				id == null
					? null
					: await app.prisma.account.findUnique({
							where: {id},
							select: {
								id: true,
								type: true,
								name: true,
								email: true,
								status: true,
								avatar: true,
								createdAt: true,
								updatedAt: true,
								permissions: true,
							},
						});

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.post(
		'/me',
		{
			onRequest: [app.csrfProtection],
			schema: {
				tags: ['Account'],
				body: CreateAccountInputDefinition.omit({
					type: true,
					permissions: true,
				}),
				response: {
					201: SuccessfulHttpResponseDefinition(AccountDefinition),
					400: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			if (await app.prisma.account.exists({email: req.body.email})) {
				return reply.badRequest('Email is already in use');
			}

			const data = await app.prisma.account.create({
				data: {
					type: 'MEMBER',
					status: 'ACTIVE',
					...req.body,
					password: await hash(req.body.password, 8),
				},
				select: {
					id: true,
					type: true,
					name: true,
					email: true,
					status: true,
					avatar: true,
					createdAt: true,
					updatedAt: true,
					permissions: true,
				},
			});

			req.session.set('account', data.id);

			return reply.code(201).send({
				ok: true,
				data,
			});
		},
	);

	app.patch(
		'/me',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyAuth],
			schema: {
				tags: ['Account'],
				body: UpdateAccountDataInputDefinition.omit({
					password: true,
					permissions: true,
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(AccountDefinition.nullable()),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			if (
				req.body.email &&
				(await app.prisma.account.exists({
					email: req.body.email,
					id: {not: {equals: req.account.id}},
				}))
			) {
				return reply.badRequest('Email is already in use');
			}

			const data = await app.prisma.account.update({
				where: {id: req.account.id},
				data: req.body,
				select: {
					id: true,
					type: true,
					name: true,
					email: true,
					status: true,
					avatar: true,
					createdAt: true,
					updatedAt: true,
					permissions: true,
				},
			});

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.delete(
		'/me',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyAuth],
			schema: {
				tags: ['Account'],
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
			await app.prisma.account.delete({where: {id: req.account.id}});
			req.session.delete();
			return reply.send({
				ok: true,
			});
		},
	);

	app.post(
		'/change-password',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyAuth],
			schema: {
				tags: ['Account'],
				body: ChangePasswordInputDefinition,
				response: {
					200: VoidSuccessfulHttpResponseDefinition,
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const {password} = await app.prisma.account.findUniqueOrThrow({
				where: {id: req.account.id},
				select: {
					password: true,
				},
			});

			const matches = await compare(req.body.oldPassword, password);

			if (!matches) return reply.badRequest('Old password is incorrect');

			await app.prisma.account.update({
				where: {
					id: req.account.id,
				},
				data: {
					password: await hash(req.body.newPassword, 8),
				},
			});

			return reply.send({
				ok: true,
			});
		},
	);

	app.post(
		'/reset-password',
		{
			onRequest: [app.csrfProtection],
			schema: {
				tags: ['Account'],
				body: ResetPasswordInputDefinition,
				response: {
					200: VoidSuccessfulHttpResponseDefinition,
					400: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const now = new Date();
			const code = req.body.otpCode;

			const otp = await app.prisma.otp.findUnique({
				where: {
					code,
				},
				select: {
					email: true,
					expiresAt: true,
					createdAt: true,
				},
			});

			if (!otp) return reply.badRequest('Invalid OTP code');

			if (otp.expiresAt.getTime() <= now.getTime()) {
				await app.prisma.otp.delete({
					where: {
						code,
					},
				});

				return reply.badRequest('OTP code has expired');
			}

			const account = await app.prisma.account.findUnique({
				where: {
					email: otp.email,
				},
				select: {
					id: true,
				},
			});

			if (!account) {
				await app.prisma.otp.delete({
					where: {
						code,
					},
				});

				return reply.badRequest('Account not found');
			}

			await app.prisma.$transaction([
				app.prisma.account.update({
					where: {
						id: account.id,
					},
					data: {
						password: await hash(req.body.newPassword, 8),
					},
				}),
				app.prisma.otp.delete({
					where: {
						code,
					},
				}),
			]);

			return reply.send({ok: true});
		},
	);
};

export default plugin;

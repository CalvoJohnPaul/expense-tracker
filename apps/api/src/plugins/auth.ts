import type {AccountType, Permission} from '@expense-tracker/defs';
import type {FastifyInstance} from 'fastify';
import fp from 'fastify-plugin';
import {prisma} from '../config/prisma';

export default fp(
	async (fastify: FastifyInstance): Promise<void> => {
		fastify.decorate('verifyAuth', async (request, reply) => {
			const id = request.session.get('account');
			const account = !id
				? null
				: await prisma.account.findUnique({
						where: {id},
						select: {
							id: true,
							type: true,
							permissions: true,
						},
					});

			if (account == null) return reply.unauthorized();

			request.account = account;
		});

		fastify.decorate('verifyAdmin', async (request, reply) => {
			const id = request.session.get('account');
			const account = !id
				? null
				: await prisma.account.findUnique({
						where: {id},
						select: {
							id: true,
							type: true,
							permissions: true,
						},
					});

			if (account?.type !== 'ADMIN') return reply.unauthorized();

			request.account = account;
		});

		fastify.decorate('verifyMember', async (request, reply) => {
			const id = request.session.get('account');
			const account = !id
				? null
				: await prisma.account.findUnique({
						where: {id},
						select: {
							id: true,
							type: true,
							permissions: true,
						},
					});

			if (account?.type !== 'MEMBER') return reply.unauthorized();

			request.account = account;
		});
	},
	{
		name: 'fastify-auth',
		fastify: '5.x',
		dependencies: ['fastify-prisma', '@fastify/secure-session'],
	},
);

declare module 'fastify' {
	interface FastifyInstance {
		verifyAuth(req: FastifyRequest, reply: FastifyReply, done: () => void): void;
		verifyAdmin(req: FastifyRequest, reply: FastifyReply, done: () => void): void;
		verifyMember(req: FastifyRequest, reply: FastifyReply, done: () => void): void;
	}

	interface FastifyRequest {
		account: {
			id: number;
			type: AccountType;
			permissions: Permission[];
		};
	}
}

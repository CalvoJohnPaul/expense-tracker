import {
	AccountAggregateDefinition,
	AccountDefinition,
	AccountSortColumnInputDefinition,
	AccountStatusDefinition,
	AccountTypeDefinition,
	CreateAccountInputDefinition,
	FailedHttpResponseDefinition,
	PaginatedDefinition,
	SortOrderDefinition,
	SuccessfulHttpResponseDefinition,
	UpdateAccountDataInputDefinition,
	VoidHttpResponseDefinition,
} from '@expense-tracker/defs';
import {hash} from 'bcrypt';
import {clamp} from 'es-toolkit';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import * as z from 'zod';
import type {Prisma} from '../.generated/prisma/client';
import {
	QueryString__DateDefinition,
	QueryString__EnumArrayDefinition,
	QueryString__EnumDefinition,
	QueryString__NumberArrayDefinition,
	QueryString__NumberDefinition,
	QueryString__StringArrayDefinition,
	QueryString__StringDefinition,
} from '../definitions';

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/',
		{
			preHandler: [app.verifyAdmin],
			schema: {
				tags: ['Account'],
				querystring: z.object({
					page: QueryString__NumberDefinition,
					pageSize: QueryString__NumberDefinition,
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					type__eq: QueryString__EnumDefinition(AccountTypeDefinition),
					type__neq: QueryString__EnumDefinition(AccountTypeDefinition),
					type__in: QueryString__EnumArrayDefinition(AccountTypeDefinition),
					type__nin: QueryString__EnumArrayDefinition(AccountTypeDefinition),
					name__eq: QueryString__StringDefinition,
					name__neq: QueryString__StringDefinition,
					name__in: QueryString__StringArrayDefinition,
					name__nin: QueryString__StringArrayDefinition,
					name__contains: QueryString__StringDefinition,
					email__eq: QueryString__StringDefinition,
					email__neq: QueryString__StringDefinition,
					email__in: QueryString__StringArrayDefinition,
					email__nin: QueryString__StringArrayDefinition,
					email__contains: QueryString__StringDefinition,
					status__eq: QueryString__EnumDefinition(AccountStatusDefinition),
					status__neq: QueryString__EnumDefinition(AccountStatusDefinition),
					status__in: QueryString__EnumArrayDefinition(AccountStatusDefinition),
					status__nin: QueryString__EnumArrayDefinition(AccountStatusDefinition),
					createdAt__gt: QueryString__DateDefinition,
					createdAt__gte: QueryString__DateDefinition,
					createdAt__lt: QueryString__DateDefinition,
					createdAt__lte: QueryString__DateDefinition,
					updatedAt__gt: QueryString__DateDefinition,
					updatedAt__gte: QueryString__DateDefinition,
					updatedAt__lt: QueryString__DateDefinition,
					updatedAt__lte: QueryString__DateDefinition,
					sortBy: AccountSortColumnInputDefinition.optional().nullable(),
					sortOrder: SortOrderDefinition.optional().nullable(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(PaginatedDefinition(AccountDefinition)),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const where: Prisma.AccountWhereInput = {};

			if (
				req.query.id__eq != null ||
				req.query.id__neq != null ||
				req.query.id__in != null ||
				req.query.id__nin != null
			) {
				where.id = {
					...(req.query.id__eq != null && {equals: req.query.id__eq}),
					...(req.query.id__neq != null && {not: req.query.id__neq}),
					...(req.query.id__in != null && {in: req.query.id__in}),
					...(req.query.id__nin != null && {notIn: req.query.id__nin}),
				};
			}

			if (
				req.query.type__eq != null ||
				req.query.type__neq != null ||
				req.query.type__in != null ||
				req.query.type__nin != null
			) {
				where.type = {
					...(req.query.type__eq != null && {equals: req.query.type__eq}),
					...(req.query.type__neq != null && {not: req.query.type__neq}),
					...(req.query.type__in != null && {in: req.query.type__in}),
					...(req.query.type__nin != null && {notIn: req.query.type__nin}),
				};
			}

			if (
				req.query.name__eq != null ||
				req.query.name__neq != null ||
				req.query.name__in != null ||
				req.query.name__nin != null ||
				req.query.name__contains
			) {
				where.name = {
					...(req.query.name__eq != null && {equals: req.query.name__eq}),
					...(req.query.name__neq != null && {not: req.query.name__neq}),
					...(req.query.name__in != null && {in: req.query.name__in}),
					...(req.query.name__nin != null && {notIn: req.query.name__nin}),
					...(req.query.name__contains != null && {
						contains: req.query.name__contains,
						mode: 'insensitive',
					}),
				};
			}

			if (
				req.query.email__eq != null ||
				req.query.email__neq != null ||
				req.query.email__in != null ||
				req.query.email__nin != null ||
				req.query.email__contains
			) {
				where.email = {
					...(req.query.email__eq != null && {equals: req.query.email__eq}),
					...(req.query.email__neq != null && {not: req.query.email__neq}),
					...(req.query.email__in != null && {in: req.query.email__in}),
					...(req.query.email__nin != null && {notIn: req.query.email__nin}),
					...(req.query.email__contains != null && {
						contains: req.query.email__contains,
						mode: 'insensitive',
					}),
				};
			}

			if (
				req.query.status__eq != null ||
				req.query.status__neq != null ||
				req.query.status__in != null ||
				req.query.status__nin != null
			) {
				where.status = {
					...(req.query.status__eq != null && {equals: req.query.status__eq}),
					...(req.query.status__neq != null && {not: req.query.status__neq}),
					...(req.query.status__in != null && {in: req.query.status__in}),
					...(req.query.status__nin != null && {notIn: req.query.status__nin}),
				};
			}

			if (
				req.query.createdAt__gt != null ||
				req.query.createdAt__gte != null ||
				req.query.createdAt__lt != null ||
				req.query.createdAt__lte != null
			) {
				where.createdAt = {
					...(req.query.createdAt__gt != null && {gt: req.query.createdAt__gt}),
					...(req.query.createdAt__gte != null && {gte: req.query.createdAt__gte}),
					...(req.query.createdAt__lt != null && {lt: req.query.createdAt__lt}),
					...(req.query.createdAt__lte != null && {lte: req.query.createdAt__lte}),
				};
			}

			if (
				req.query.updatedAt__gt != null ||
				req.query.updatedAt__gte != null ||
				req.query.updatedAt__lt != null ||
				req.query.updatedAt__lte != null
			) {
				where.updatedAt = {
					...(req.query.updatedAt__gt != null && {gt: req.query.updatedAt__gt}),
					...(req.query.updatedAt__gte != null && {gte: req.query.updatedAt__gte}),
					...(req.query.updatedAt__lt != null && {lt: req.query.updatedAt__lt}),
					...(req.query.updatedAt__lte != null && {lte: req.query.updatedAt__lte}),
				};
			}

			const page = req.query.page ?? 1;
			const take = clamp(req.query.pageSize ?? 10, 10, 100);
			const skip = take * (page - 1);

			const [total, rows] = await app.prisma.$transaction([
				app.prisma.account.count({where}),
				app.prisma.account.findMany({
					skip,
					take,
					where,
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
					orderBy: {
						createdAt: 'desc',
					},
					...(req.query.sortBy != null && {
						orderBy: {
							...(req.query.sortBy === 'CREATED_AT' && {
								createdAt: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
							}),
							...(req.query.sortBy === 'UPDATED_AT' && {
								updatedAt: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
							}),
						},
					}),
				}),
			]);

			const hasNext = page < Math.ceil(total / take);
			const hasPrevious = page > 1;
			const next = hasNext ? page + 1 : null;
			const previous = page > 1 ? page - 1 : null;

			return reply.send({
				ok: true,
				data: {
					rows,
					next,
					hasNext,
					previous,
					hasPrevious,
				},
			});
		},
	);

	app.get(
		'/aggregate',
		{
			preHandler: [app.verifyAdmin],
			schema: {
				tags: ['Account'],
				querystring: z.object({
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					type__eq: QueryString__EnumDefinition(AccountTypeDefinition),
					type__neq: QueryString__EnumDefinition(AccountTypeDefinition),
					type__in: QueryString__EnumArrayDefinition(AccountTypeDefinition),
					type__nin: QueryString__EnumArrayDefinition(AccountTypeDefinition),
					name__eq: QueryString__StringDefinition,
					name__neq: QueryString__StringDefinition,
					name__in: QueryString__StringArrayDefinition,
					name__nin: QueryString__StringArrayDefinition,
					name__contains: QueryString__StringDefinition,
					email__eq: QueryString__StringDefinition,
					email__neq: QueryString__StringDefinition,
					email__in: QueryString__StringArrayDefinition,
					email__nin: QueryString__StringArrayDefinition,
					email__contains: QueryString__StringDefinition,
					status__eq: QueryString__EnumDefinition(AccountStatusDefinition),
					status__neq: QueryString__EnumDefinition(AccountStatusDefinition),
					status__in: QueryString__EnumArrayDefinition(AccountStatusDefinition),
					status__nin: QueryString__EnumArrayDefinition(AccountStatusDefinition),
					createdAt__gt: QueryString__DateDefinition,
					createdAt__gte: QueryString__DateDefinition,
					createdAt__lt: QueryString__DateDefinition,
					createdAt__lte: QueryString__DateDefinition,
					updatedAt__gt: QueryString__DateDefinition,
					updatedAt__gte: QueryString__DateDefinition,
					updatedAt__lt: QueryString__DateDefinition,
					updatedAt__lte: QueryString__DateDefinition,
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(AccountAggregateDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const where: Prisma.AccountWhereInput = {};

			if (
				req.query.id__eq != null ||
				req.query.id__neq != null ||
				req.query.id__in != null ||
				req.query.id__nin != null
			) {
				where.id = {
					...(req.query.id__eq != null && {equals: req.query.id__eq}),
					...(req.query.id__neq != null && {not: req.query.id__neq}),
					...(req.query.id__in != null && {in: req.query.id__in}),
					...(req.query.id__nin != null && {notIn: req.query.id__nin}),
				};
			}

			if (
				req.query.type__eq != null ||
				req.query.type__neq != null ||
				req.query.type__in != null ||
				req.query.type__nin != null
			) {
				where.type = {
					...(req.query.type__eq != null && {equals: req.query.type__eq}),
					...(req.query.type__neq != null && {not: req.query.type__neq}),
					...(req.query.type__in != null && {in: req.query.type__in}),
					...(req.query.type__nin != null && {notIn: req.query.type__nin}),
				};
			}

			if (
				req.query.name__eq != null ||
				req.query.name__neq != null ||
				req.query.name__in != null ||
				req.query.name__nin != null ||
				req.query.name__contains
			) {
				where.name = {
					...(req.query.name__eq != null && {equals: req.query.name__eq}),
					...(req.query.name__neq != null && {not: req.query.name__neq}),
					...(req.query.name__in != null && {in: req.query.name__in}),
					...(req.query.name__nin != null && {notIn: req.query.name__nin}),
					...(req.query.name__contains != null && {
						contains: req.query.name__contains,
						mode: 'insensitive',
					}),
				};
			}

			if (
				req.query.email__eq != null ||
				req.query.email__neq != null ||
				req.query.email__in != null ||
				req.query.email__nin != null ||
				req.query.email__contains
			) {
				where.email = {
					...(req.query.email__eq != null && {equals: req.query.email__eq}),
					...(req.query.email__neq != null && {not: req.query.email__neq}),
					...(req.query.email__in != null && {in: req.query.email__in}),
					...(req.query.email__nin != null && {notIn: req.query.email__nin}),
					...(req.query.email__contains != null && {
						contains: req.query.email__contains,
						mode: 'insensitive',
					}),
				};
			}

			if (
				req.query.status__eq != null ||
				req.query.status__neq != null ||
				req.query.status__in != null ||
				req.query.status__nin != null
			) {
				where.status = {
					...(req.query.status__eq != null && {equals: req.query.status__eq}),
					...(req.query.status__neq != null && {not: req.query.status__neq}),
					...(req.query.status__in != null && {in: req.query.status__in}),
					...(req.query.status__nin != null && {notIn: req.query.status__nin}),
				};
			}

			if (
				req.query.createdAt__gt != null ||
				req.query.createdAt__gte != null ||
				req.query.createdAt__lt != null ||
				req.query.createdAt__lte != null
			) {
				where.createdAt = {
					...(req.query.createdAt__gt != null && {gt: req.query.createdAt__gt}),
					...(req.query.createdAt__gte != null && {gte: req.query.createdAt__gte}),
					...(req.query.createdAt__lt != null && {lt: req.query.createdAt__lt}),
					...(req.query.createdAt__lte != null && {lte: req.query.createdAt__lte}),
				};
			}

			if (
				req.query.updatedAt__gt != null ||
				req.query.updatedAt__gte != null ||
				req.query.updatedAt__lt != null ||
				req.query.updatedAt__lte != null
			) {
				where.updatedAt = {
					...(req.query.updatedAt__gt != null && {gt: req.query.updatedAt__gt}),
					...(req.query.updatedAt__gte != null && {gte: req.query.updatedAt__gte}),
					...(req.query.updatedAt__lt != null && {lt: req.query.updatedAt__lt}),
					...(req.query.updatedAt__lte != null && {lte: req.query.updatedAt__lte}),
				};
			}

			const result = await app.prisma.account.aggregate({
				where,
				_count: {
					id: true,
				},
			});

			return reply.send({
				ok: true,
				data: {
					total: result._count.id ?? 0,
				},
			});
		},
	);

	app.get(
		'/:id',
		{
			preHandler: [app.verifyAdmin],
			schema: {
				tags: ['Account'],
				params: z.object({
					id: z.coerce.number(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(AccountDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const data = await app.prisma.account.findUnique({
				where: {id: req.params.id},
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

			if (!data) return reply.notFound();

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.post(
		'/',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyAdmin],
			schema: {
				tags: ['Account'],
				body: CreateAccountInputDefinition,
				response: {
					201: SuccessfulHttpResponseDefinition(AccountDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			if (
				(req.body.type === 'ADMIN' && !req.account.permissions.includes('CREATE_ADMIN_ACCOUNT')) ||
				(req.body.type === 'MEMBER' && !req.account.permissions.includes('CREATE_MEMBER_ACCOUNT'))
			) {
				return reply.forbidden();
			}

			if (await app.prisma.account.exists({email: req.body.email})) {
				return reply.badRequest('Email is already in use');
			}

			const data = await app.prisma.account.create({
				data: {
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

			await app.prisma.adminActivity.create({
				data: {
					type: req.body.type === 'ADMIN' ? 'CREATE_ADMIN_ACCOUNT' : 'CREATE_MEMBER_ACCOUNT',
					accountId: req.account.id,
					details: {
						id: data.id,
						name: data.name,
						email: data.email,
					},
				},
				select: {
					id: true,
				},
			});

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.patch(
		'/:id',
		{
			preHandler: [app.verifyAdmin],
			onRequest: [app.csrfProtection],
			schema: {
				tags: ['Account'],
				params: z.object({
					id: z.coerce.number(),
				}),
				body: UpdateAccountDataInputDefinition,
				response: {
					200: SuccessfulHttpResponseDefinition(AccountDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const account = await app.prisma.account.findUnique({
				where: {id: req.params.id},
				select: {
					type: true,
					status: true,
				},
			});

			if (account == null) return reply.notFound();
			if (
				(account.type === 'ADMIN' && !req.account.permissions.includes('UPDATE_ADMIN_ACCOUNT')) ||
				(account.type === 'MEMBER' && !req.account.permissions.includes('UPDATE_MEMBER_ACCOUNT'))
			) {
				return reply.forbidden();
			}

			if (
				req.body.email &&
				(await app.prisma.account.exists({
					email: req.body.email,
					id: {not: {equals: req.params.id}},
				}))
			) {
				return reply.badRequest('Email is already in use');
			}

			const [data] = await app.prisma.$transaction([
				app.prisma.account.update({
					where: {id: req.params.id},
					data: {
						...req.body,
						password: req.body.password ? await hash(req.body.password, 8) : undefined,
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
				}),
				app.prisma.adminActivity.create({
					data: {
						type: account.type === 'MEMBER' ? 'UPDATE_MEMBER_ACCOUNT' : 'UPDATE_ADMIN_ACCOUNT',
						accountId: req.account.id,
						details: {
							id: req.params.id,
							...req.body,
						},
					},
					select: {id: true},
				}),
			]);

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.delete(
		'/:id',
		{
			preHandler: [app.verifyAdmin],
			onRequest: [app.csrfProtection],
			schema: {
				tags: ['Account'],
				params: z.object({
					id: z.coerce.number(),
				}),
				response: {
					200: VoidHttpResponseDefinition,
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const account = await app.prisma.account.findUnique({
				where: {id: req.params.id},
				select: {
					type: true,
					name: true,
					email: true,
				},
			});

			if (account == null) return reply.notFound();
			if (
				(account.type === 'ADMIN' && !req.account.permissions.includes('DELETE_ADMIN_ACCOUNT')) ||
				(account.type === 'MEMBER' && !req.account.permissions.includes('DELETE_MEMBER_ACCOUNT'))
			) {
				return reply.forbidden();
			}

			await app.prisma.$transaction([
				app.prisma.account.delete({
					where: {id: req.params.id},
				}),
				app.prisma.adminActivity.create({
					data: {
						type: account.type === 'MEMBER' ? 'DELETE_MEMBER_ACCOUNT' : 'DELETE_ADMIN_ACCOUNT',
						accountId: req.account.id,
						details: {
							id: req.params.id,
							name: account.name,
							email: account.email,
						},
					},
					select: {
						id: true,
					},
				}),
			]);

			return reply.send({
				ok: true,
			});
		},
	);

	app.post(
		'/:id/suspend',
		{
			preHandler: [app.verifyAdmin],
			onRequest: [app.csrfProtection],
			schema: {
				tags: ['Account'],
				params: z.object({
					id: z.coerce.number(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(AccountDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const account = await app.prisma.account.findUnique({
				where: {id: req.params.id},
				select: {
					type: true,
					name: true,
					email: true,
					status: true,
				},
			});

			if (account == null) return reply.notFound();
			if (
				(account.type === 'ADMIN' && !req.account.permissions.includes('UPDATE_ADMIN_ACCOUNT')) ||
				(account.type === 'MEMBER' && !req.account.permissions.includes('UPDATE_MEMBER_ACCOUNT'))
			) {
				return reply.forbidden();
			}

			if (account.status === 'SUSPENDED') return reply.badRequest();

			const [data] = await app.prisma.$transaction([
				app.prisma.account.update({
					where: {id: req.params.id},
					data: {
						status: 'SUSPENDED',
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
				}),
				app.prisma.adminActivity.create({
					data: {
						type: account.type === 'MEMBER' ? 'SUSPEND_MEMBER_ACCOUNT' : 'SUSPEND_ADMIN_ACCOUNT',
						accountId: req.account.id,
						details: {
							id: req.params.id,
							name: account.name,
							email: account.email,
						},
					},
					select: {
						id: true,
					},
				}),
			]);

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.post(
		'/:id/unsuspend',
		{
			preHandler: [app.verifyAdmin],
			onRequest: [app.csrfProtection],
			schema: {
				tags: ['Account'],
				params: z.object({
					id: z.coerce.number(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(AccountDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const account = await app.prisma.account.findUnique({
				where: {id: req.params.id},
				select: {
					type: true,
					name: true,
					email: true,
					status: true,
				},
			});

			if (account == null) return reply.notFound();
			if (
				(account.type === 'ADMIN' &&
					!req.account.permissions.includes('UNSUSPEND_ADMIN_ACCOUNT')) ||
				(account.type === 'MEMBER' && !req.account.permissions.includes('UNSUSPEND_MEMBER_ACCOUNT'))
			) {
				return reply.forbidden();
			}

			if (account.status === 'ACTIVE') return reply.badRequest();

			const [data] = await app.prisma.$transaction([
				app.prisma.account.update({
					data: {
						status: 'ACTIVE',
					},
					where: {
						id: req.params.id,
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
				}),
				app.prisma.adminActivity.create({
					data: {
						type:
							account.type === 'MEMBER' ? 'UNSUSPEND_MEMBER_ACCOUNT' : 'UNSUSPEND_ADMIN_ACCOUNT',
						accountId: req.account.id,
						details: {
							id: req.params.id,
							name: account.name,
							email: account.email,
						},
					},
					select: {
						id: true,
					},
				}),
			]);

			return reply.send({
				ok: true,
				data,
			});
		},
	);
};

export const autoPrefix = '/accounts';
export default plugin;

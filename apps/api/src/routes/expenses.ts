import {
	CreateExpenseInputDefinition,
	ExpenseAggregateDefinition,
	ExpenseCategoryDefinition,
	ExpenseDefinition,
	ExpenseSortColumnInputDefinition,
	FailedHttpResponseDefinition,
	PaginatedDefinition,
	SortOrderDefinition,
	SuccessfulHttpResponseDefinition,
	UpdateExpenseDataInputDefinition,
	VoidSuccessfulHttpResponseDefinition,
} from '@expense-tracker/defs';
import {clamp} from 'es-toolkit';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {uid} from 'uid';
import XLSX from 'xlsx';
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
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Expense'],
				querystring: z.object({
					page: QueryString__NumberDefinition,
					pageSize: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					category__eq: QueryString__EnumDefinition(ExpenseCategoryDefinition),
					category__neq: QueryString__EnumDefinition(ExpenseCategoryDefinition),
					category__in: QueryString__EnumArrayDefinition(ExpenseCategoryDefinition),
					category__nin: QueryString__EnumArrayDefinition(ExpenseCategoryDefinition),
					location__eq: QueryString__StringDefinition,
					location__neq: QueryString__StringDefinition,
					location__in: QueryString__StringArrayDefinition,
					location__nin: QueryString__StringArrayDefinition,
					location__contains: QueryString__StringDefinition,
					amount__gt: QueryString__NumberDefinition,
					amount__gte: QueryString__NumberDefinition,
					amount__lt: QueryString__NumberDefinition,
					amount__lte: QueryString__NumberDefinition,
					transactionDate__gt: QueryString__DateDefinition,
					transactionDate__gte: QueryString__DateDefinition,
					transactionDate__lt: QueryString__DateDefinition,
					transactionDate__lte: QueryString__DateDefinition,
					createdAt__gt: QueryString__DateDefinition,
					createdAt__gte: QueryString__DateDefinition,
					createdAt__lt: QueryString__DateDefinition,
					createdAt__lte: QueryString__DateDefinition,
					updatedAt__gt: QueryString__DateDefinition,
					updatedAt__gte: QueryString__DateDefinition,
					updatedAt__lt: QueryString__DateDefinition,
					updatedAt__lte: QueryString__DateDefinition,
					sortBy: ExpenseSortColumnInputDefinition.optional().nullable(),
					sortOrder: SortOrderDefinition.optional().nullable(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(PaginatedDefinition(ExpenseDefinition)),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const where: Prisma.ExpenseWhereInput = {
				accountId: req.account.id,
			};

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
				req.query.category__eq != null ||
				req.query.category__neq != null ||
				req.query.category__in != null ||
				req.query.category__nin != null
			) {
				where.category = {
					...(req.query.category__eq != null && {equals: req.query.category__eq}),
					...(req.query.category__neq != null && {not: req.query.category__neq}),
					...(req.query.category__in != null && {in: req.query.category__in}),
					...(req.query.category__nin != null && {notIn: req.query.category__nin}),
				};
			}

			if (
				req.query.location__eq != null ||
				req.query.location__neq != null ||
				req.query.location__in != null ||
				req.query.location__nin != null ||
				req.query.location__contains
			) {
				where.location = {
					...(req.query.location__eq != null && {equals: req.query.location__eq}),
					...(req.query.location__neq != null && {not: req.query.location__neq}),
					...(req.query.location__in != null && {in: req.query.location__in}),
					...(req.query.location__nin != null && {notIn: req.query.location__nin}),
					...(req.query.location__contains != null && {contains: req.query.location__contains}),
				};
			}

			if (
				req.query.amount__gt != null ||
				req.query.amount__gte != null ||
				req.query.amount__lt != null ||
				req.query.amount__lte != null
			) {
				where.amount = {
					...(req.query.amount__gt != null && {gt: req.query.amount__gt}),
					...(req.query.amount__gte != null && {gte: req.query.amount__gte}),
					...(req.query.amount__lt != null && {lt: req.query.amount__lt}),
					...(req.query.amount__lte != null && {lte: req.query.amount__lte}),
				};
			}

			if (
				req.query.transactionDate__gt != null ||
				req.query.transactionDate__gte != null ||
				req.query.transactionDate__lt != null ||
				req.query.transactionDate__lte != null
			) {
				where.transactionDate = {
					...(req.query.transactionDate__gt != null && {gt: req.query.transactionDate__gt}),
					...(req.query.transactionDate__gte != null && {gte: req.query.transactionDate__gte}),
					...(req.query.transactionDate__lt != null && {lt: req.query.transactionDate__lt}),
					...(req.query.transactionDate__lte != null && {lte: req.query.transactionDate__lte}),
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
				app.prisma.expense.count({where}),
				app.prisma.expense.findMany({
					take,
					skip,
					where,
					select: {
						id: true,
						amount: true,
						category: true,
						location: true,
						description: true,
						transactionDate: true,
						createdAt: true,
						updatedAt: true,
					},
					orderBy: {
						createdAt: 'desc',
					},
					...(req.query.sortBy != null && {
						orderBy: {
							...(req.query.sortBy === 'AMOUNT' && {
								amount: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
							}),
							...(req.query.sortBy === 'TRANSACTION_DATE' && {
								transactionDate: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
							}),
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
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Expense'],
				querystring: z.object({
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					category__eq: QueryString__EnumDefinition(ExpenseCategoryDefinition),
					category__neq: QueryString__EnumDefinition(ExpenseCategoryDefinition),
					category__in: QueryString__EnumArrayDefinition(ExpenseCategoryDefinition),
					category__nin: QueryString__EnumArrayDefinition(ExpenseCategoryDefinition),
					location__eq: QueryString__StringDefinition,
					location__neq: QueryString__StringDefinition,
					location__in: QueryString__StringArrayDefinition,
					location__nin: QueryString__StringArrayDefinition,
					location__contains: QueryString__StringDefinition,
					amount__gt: QueryString__NumberDefinition,
					amount__gte: QueryString__NumberDefinition,
					amount__lt: QueryString__NumberDefinition,
					amount__lte: QueryString__NumberDefinition,
					transactionDate__gt: QueryString__DateDefinition,
					transactionDate__gte: QueryString__DateDefinition,
					transactionDate__lt: QueryString__DateDefinition,
					transactionDate__lte: QueryString__DateDefinition,
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
					200: SuccessfulHttpResponseDefinition(ExpenseAggregateDefinition),
					401: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const where: Prisma.ExpenseWhereInput = {
				accountId: req.account.id,
			};

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
				req.query.category__eq != null ||
				req.query.category__neq != null ||
				req.query.category__in != null ||
				req.query.category__nin != null
			) {
				where.category = {
					...(req.query.category__eq != null && {equals: req.query.category__eq}),
					...(req.query.category__neq != null && {not: req.query.category__neq}),
					...(req.query.category__in != null && {in: req.query.category__in}),
					...(req.query.category__nin != null && {notIn: req.query.category__nin}),
				};
			}

			if (
				req.query.location__eq != null ||
				req.query.location__neq != null ||
				req.query.location__in != null ||
				req.query.location__nin != null ||
				req.query.location__contains
			) {
				where.location = {
					...(req.query.location__eq != null && {equals: req.query.location__eq}),
					...(req.query.location__neq != null && {not: req.query.location__neq}),
					...(req.query.location__in != null && {in: req.query.location__in}),
					...(req.query.location__nin != null && {notIn: req.query.location__nin}),
					...(req.query.location__contains != null && {contains: req.query.location__contains}),
				};
			}

			if (
				req.query.amount__gt != null ||
				req.query.amount__gte != null ||
				req.query.amount__lt != null ||
				req.query.amount__lte != null
			) {
				where.amount = {
					...(req.query.amount__gt != null && {gt: req.query.amount__gt}),
					...(req.query.amount__gte != null && {gte: req.query.amount__gte}),
					...(req.query.amount__lt != null && {lt: req.query.amount__lt}),
					...(req.query.amount__lte != null && {lte: req.query.amount__lte}),
				};
			}

			if (
				req.query.transactionDate__gt != null ||
				req.query.transactionDate__gte != null ||
				req.query.transactionDate__lt != null ||
				req.query.transactionDate__lte != null
			) {
				where.transactionDate = {
					...(req.query.transactionDate__gt != null && {gt: req.query.transactionDate__gt}),
					...(req.query.transactionDate__gte != null && {gte: req.query.transactionDate__gte}),
					...(req.query.transactionDate__lt != null && {lt: req.query.transactionDate__lt}),
					...(req.query.transactionDate__lte != null && {lte: req.query.transactionDate__lte}),
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

			const result = await app.prisma.expense.aggregate({
				where,
				_sum: {
					amount: true,
				},
				_count: {
					id: true,
				},
			});

			return reply.send({
				ok: true,
				data: {
					amount: result._sum.amount ?? 0,
					total: result._count.id ?? 0,
				},
			});
		},
	);

	app.get(
		'/:id',
		{
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Expense'],
				params: z.object({
					id: z.coerce.number(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(ExpenseDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const data = await app.prisma.expense.findUnique({
				where: {
					id: req.params.id,
					accountId: req.account.id,
				},
				select: {
					id: true,
					amount: true,
					location: true,
					category: true,
					description: true,
					transactionDate: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (data == null) return reply.notFound();

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
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Expense'],
				body: CreateExpenseInputDefinition,
				response: {
					201: SuccessfulHttpResponseDefinition(ExpenseDefinition.nullable()),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const data = await app.prisma.expense.create({
				data: {
					...req.body,
					accountId: req.account.id,
				},
				select: {
					id: true,
					amount: true,
					location: true,
					category: true,
					description: true,
					transactionDate: true,
					createdAt: true,
					updatedAt: true,
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
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Expense'],
				params: z.object({
					id: z.coerce.number(),
				}),
				body: UpdateExpenseDataInputDefinition,
				response: {
					200: SuccessfulHttpResponseDefinition(ExpenseDefinition.nullable()),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const exists = await app.prisma.expense.exists({
				id: req.params.id,
				accountId: req.account.id,
			});

			if (!exists) return reply.notFound();

			const data = await app.prisma.expense.update({
				where: {
					id: req.params.id,
				},
				data: req.body,
				select: {
					id: true,
					amount: true,
					location: true,
					category: true,
					description: true,
					transactionDate: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.delete(
		'/:id',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Expense'],
				params: z.object({
					id: z.coerce.number(),
				}),
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
			await app.prisma.expense.delete({
				where: {
					id: req.params.id,
					accountId: req.account.id,
				},
			});

			return reply.send({
				ok: true,
			});
		},
	);

	app.post(
		'/export',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Expense'],
				querystring: z.object({
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					category__eq: QueryString__EnumDefinition(ExpenseCategoryDefinition),
					category__neq: QueryString__EnumDefinition(ExpenseCategoryDefinition),
					category__in: QueryString__EnumArrayDefinition(ExpenseCategoryDefinition),
					category__nin: QueryString__EnumArrayDefinition(ExpenseCategoryDefinition),
					location__eq: QueryString__StringDefinition,
					location__neq: QueryString__StringDefinition,
					location__in: QueryString__StringArrayDefinition,
					location__nin: QueryString__StringArrayDefinition,
					location__contains: QueryString__StringDefinition,
					amount__gt: QueryString__NumberDefinition,
					amount__gte: QueryString__NumberDefinition,
					amount__lt: QueryString__NumberDefinition,
					amount__lte: QueryString__NumberDefinition,
					transactionDate__gt: QueryString__DateDefinition,
					transactionDate__gte: QueryString__DateDefinition,
					transactionDate__lt: QueryString__DateDefinition,
					transactionDate__lte: QueryString__DateDefinition,
					createdAt__gt: QueryString__DateDefinition,
					createdAt__gte: QueryString__DateDefinition,
					createdAt__lt: QueryString__DateDefinition,
					createdAt__lte: QueryString__DateDefinition,
					updatedAt__gt: QueryString__DateDefinition,
					updatedAt__gte: QueryString__DateDefinition,
					updatedAt__lt: QueryString__DateDefinition,
					updatedAt__lte: QueryString__DateDefinition,
					sortBy: ExpenseSortColumnInputDefinition.optional().nullable(),
					sortOrder: SortOrderDefinition.optional().nullable(),
				}),
				response: {
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const where: Prisma.ExpenseWhereInput = {
				accountId: req.account.id,
			};

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
				req.query.category__eq != null ||
				req.query.category__neq != null ||
				req.query.category__in != null ||
				req.query.category__nin != null
			) {
				where.category = {
					...(req.query.category__eq != null && {equals: req.query.category__eq}),
					...(req.query.category__neq != null && {not: req.query.category__neq}),
					...(req.query.category__in != null && {in: req.query.category__in}),
					...(req.query.category__nin != null && {notIn: req.query.category__nin}),
				};
			}

			if (
				req.query.location__eq != null ||
				req.query.location__neq != null ||
				req.query.location__in != null ||
				req.query.location__nin != null ||
				req.query.location__contains
			) {
				where.location = {
					...(req.query.location__eq != null && {equals: req.query.location__eq}),
					...(req.query.location__neq != null && {not: req.query.location__neq}),
					...(req.query.location__in != null && {in: req.query.location__in}),
					...(req.query.location__nin != null && {notIn: req.query.location__nin}),
					...(req.query.location__contains != null && {contains: req.query.location__contains}),
				};
			}

			if (
				req.query.amount__gt != null ||
				req.query.amount__gte != null ||
				req.query.amount__lt != null ||
				req.query.amount__lte != null
			) {
				where.amount = {
					...(req.query.amount__gt != null && {gt: req.query.amount__gt}),
					...(req.query.amount__gte != null && {gte: req.query.amount__gte}),
					...(req.query.amount__lt != null && {lt: req.query.amount__lt}),
					...(req.query.amount__lte != null && {lte: req.query.amount__lte}),
				};
			}

			if (
				req.query.transactionDate__gt != null ||
				req.query.transactionDate__gte != null ||
				req.query.transactionDate__lt != null ||
				req.query.transactionDate__lte != null
			) {
				where.transactionDate = {
					...(req.query.transactionDate__gt != null && {gt: req.query.transactionDate__gt}),
					...(req.query.transactionDate__gte != null && {gte: req.query.transactionDate__gte}),
					...(req.query.transactionDate__lt != null && {lt: req.query.transactionDate__lt}),
					...(req.query.transactionDate__lte != null && {lte: req.query.transactionDate__lte}),
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

			const rows = await app.prisma.expense.findMany({
				take: 1000,
				where,
				select: {
					id: true,
					amount: true,
					category: true,
					location: true,
					description: true,
					transactionDate: true,
					createdAt: true,
					updatedAt: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
				...(req.query.sortBy != null && {
					orderBy: {
						...(req.query.sortBy === 'AMOUNT' && {
							amount: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
						}),
						...(req.query.sortBy === 'TRANSACTION_DATE' && {
							transactionDate: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
						}),
						...(req.query.sortBy === 'CREATED_AT' && {
							createdAt: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
						}),
						...(req.query.sortBy === 'UPDATED_AT' && {
							updatedAt: req.query.sortOrder === 'ASC' ? 'asc' : 'desc',
						}),
					},
				}),
			});

			const data = rows.map((obj) => ({
				Category: obj.category,
				Description: obj.description,
				Amount: obj.amount,
				Location: obj.location,
				'Transaction Date': obj.transactionDate,
				'Date Created': obj.createdAt,
			}));

			const workbook = XLSX.utils.book_new();
			const worksheet = XLSX.utils.json_to_sheet(data);

			if (worksheet['!ref']) {
				const range = XLSX.utils.decode_range(worksheet['!ref']);

				for (let R = range.s.r + 1; R <= range.e.r; R++) {
					const amountCell = worksheet[`C${R + 1}`];
					if (amountCell) {
						amountCell.t = 'n';
						amountCell.z = '#,##0.00';
					}

					const txDateCell = worksheet[`E${R + 1}`];
					if (txDateCell) {
						txDateCell.t = 'd';
						txDateCell.z = 'yyyy-mm-dd';
					}

					const createdCell = worksheet[`F${R + 1}`];
					if (createdCell) {
						createdCell.t = 'd';
						createdCell.z = 'yyyy-mm-dd hh:mm';
					}
				}
			}

			worksheet['!cols'] = [
				{width: 20},
				{width: 50},
				{width: 20},
				{width: 25},
				{width: 20},
				{width: 20},
			];

			XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

			const buffer = XLSX.write(workbook, {type: 'buffer', bookType: 'xlsx'});
			const filename = `expenses-${uid(8)}.xlsx`;

			reply
				.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
				.header('Content-Disposition', `attachment; filename="${filename}"`)
				.send(buffer);
		},
	);
};

export const autoPrefix = '/expenses';
export default plugin;

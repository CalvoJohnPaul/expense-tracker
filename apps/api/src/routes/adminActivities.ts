import {
	AdminActivityAggregateDefinition,
	AdminActivityDefinition,
	AdminActivityTypeDefinition,
	FailedHttpResponseDefinition,
	PaginatedDefinition,
	SuccessfulHttpResponseDefinition,
} from '@expense-tracker/defs';
import {clamp} from 'es-toolkit';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {uid} from 'uid';
import XLSX from 'xlsx';
import * as z from 'zod';
import type {Prisma} from '../.generated/prisma/client';
import {
	QueryString__EnumArrayDefinition,
	QueryString__EnumDefinition,
	QueryString__NumberArrayDefinition,
	QueryString__NumberDefinition,
} from '../definitions';

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/',
		{
			preHandler: [app.verifyAdmin],
			schema: {
				tags: ['Admin Activity'],
				querystring: z.object({
					page: QueryString__NumberDefinition,
					pageSize: QueryString__NumberDefinition,
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					type__eq: QueryString__EnumDefinition(AdminActivityTypeDefinition),
					type__neq: QueryString__EnumDefinition(AdminActivityTypeDefinition),
					type__in: QueryString__EnumArrayDefinition(AdminActivityTypeDefinition),
					type__nin: QueryString__EnumArrayDefinition(AdminActivityTypeDefinition),
					account__eq: QueryString__NumberDefinition,
					account__neq: QueryString__NumberDefinition,
					account__in: QueryString__NumberArrayDefinition,
					account__nin: QueryString__NumberArrayDefinition,
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(PaginatedDefinition(AdminActivityDefinition)),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const where: Prisma.AdminActivityWhereInput = {};

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
				req.query.account__eq != null ||
				req.query.account__neq != null ||
				req.query.account__in != null ||
				req.query.account__nin != null
			) {
				where.accountId = {
					...(req.query.account__eq != null && {equals: req.query.account__eq}),
					...(req.query.account__neq != null && {not: req.query.account__neq}),
					...(req.query.account__in != null && {in: req.query.account__in}),
					...(req.query.account__nin != null && {notIn: req.query.account__nin}),
				};
			}

			const page = req.query.page ?? 1;
			const take = clamp(req.query.pageSize ?? 10, 10, 100);
			const skip = take * (page - 1);

			const [total, rows] = await app.prisma.$transaction([
				app.prisma.adminActivity.count({where}),
				app.prisma.adminActivity.findMany({
					skip,
					take,
					where,
					select: {
						id: true,
						type: true,
						details: true,
						createdAt: true,
						account: {
							select: {
								id: true,
								name: true,
							},
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
				}),
			]);

			const hasNext = page < Math.ceil(total / take);
			const hasPrevious = page > 1;
			const next = hasNext ? page + 1 : null;
			const previous = page > 1 ? page - 1 : null;

			console.log(rows);

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
				tags: ['Admin Activity'],
				querystring: z.object({
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					type__eq: QueryString__EnumDefinition(AdminActivityTypeDefinition),
					type__neq: QueryString__EnumDefinition(AdminActivityTypeDefinition),
					type__in: QueryString__EnumArrayDefinition(AdminActivityTypeDefinition),
					type__nin: QueryString__EnumArrayDefinition(AdminActivityTypeDefinition),
					account__eq: QueryString__NumberDefinition,
					account__neq: QueryString__NumberDefinition,
					account__in: QueryString__NumberArrayDefinition,
					account__nin: QueryString__NumberArrayDefinition,
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(AdminActivityAggregateDefinition),
					401: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const where: Prisma.AdminActivityWhereInput = {};

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
				req.query.account__eq != null ||
				req.query.account__neq != null ||
				req.query.account__in != null ||
				req.query.account__nin != null
			) {
				where.accountId = {
					...(req.query.account__eq != null && {equals: req.query.account__eq}),
					...(req.query.account__neq != null && {not: req.query.account__neq}),
					...(req.query.account__in != null && {in: req.query.account__in}),
					...(req.query.account__nin != null && {notIn: req.query.account__nin}),
				};
			}

			const result = await app.prisma.adminActivity.aggregate({
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
				tags: ['Admin Activity'],
				params: z.object({
					id: z.coerce.number(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(AdminActivityDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const data = await app.prisma.adminActivity.findUnique({
				where: {
					id: req.params.id,
				},
				select: {
					id: true,
					type: true,
					details: true,
					createdAt: true,
					account: {
						select: {
							id: true,
							name: true,
						},
					},
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
		'/export',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyAdmin],
			schema: {
				tags: ['Admin Activity'],
				querystring: z.object({
					page: QueryString__NumberDefinition,
					pageSize: QueryString__NumberDefinition,
					id__eq: QueryString__NumberDefinition,
					id__neq: QueryString__NumberDefinition,
					id__in: QueryString__NumberArrayDefinition,
					id__nin: QueryString__NumberArrayDefinition,
					type__eq: QueryString__EnumDefinition(AdminActivityTypeDefinition),
					type__neq: QueryString__EnumDefinition(AdminActivityTypeDefinition),
					type__in: QueryString__EnumArrayDefinition(AdminActivityTypeDefinition),
					type__nin: QueryString__EnumArrayDefinition(AdminActivityTypeDefinition),
					account__eq: QueryString__NumberDefinition,
					account__neq: QueryString__NumberDefinition,
					account__in: QueryString__NumberArrayDefinition,
					account__nin: QueryString__NumberArrayDefinition,
				}),
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const where: Prisma.AdminActivityWhereInput = {};

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
				req.query.account__eq != null ||
				req.query.account__neq != null ||
				req.query.account__in != null ||
				req.query.account__nin != null
			) {
				where.accountId = {
					...(req.query.account__eq != null && {equals: req.query.account__eq}),
					...(req.query.account__neq != null && {not: req.query.account__neq}),
					...(req.query.account__in != null && {in: req.query.account__in}),
					...(req.query.account__nin != null && {notIn: req.query.account__nin}),
				};
			}

			const rows = await app.prisma.adminActivity.findMany({
				take: 1000,
				where,
				select: {
					id: true,
					type: true,
					details: true,
					createdAt: true,
					account: {
						select: {
							id: true,
							name: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});

			const data = rows.map((obj) => ({
				Type: obj.type,
				Name: obj.account.name,
				Details: null,
				'Date Created': obj.createdAt,
			}));

			const workbook = XLSX.utils.book_new();
			const worksheet = XLSX.utils.json_to_sheet(data);

			worksheet['!cols'] = [{width: 20}, {width: 25}, {width: 50}, {width: 20}];

			XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

			const buffer = XLSX.write(workbook, {type: 'buffer', bookType: 'xlsx'});
			const filename = `admin-activities-${uid(8)}.xlsx`;

			reply
				.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
				.header('Content-Disposition', `attachment; filename="${filename}"`)
				.send(buffer);
		},
	);
};

export const autoPrefix = '/admin-activities';
export default plugin;

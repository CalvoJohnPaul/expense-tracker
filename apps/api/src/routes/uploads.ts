import {
	FailedHttpResponseDefinition,
	SuccessfulHttpResponseDefinition,
	UploadedFileDefinition,
} from '@expense-tracker/defs';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';
import {randomUUID} from 'node:crypto';
import {createWriteStream} from 'node:fs';
import {extname, join} from 'node:path';
import {pipeline} from 'node:stream/promises';
import * as z from 'zod';

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/:id',
		{
			preHandler: [app.verifyAuth],
			schema: {
				tags: ['Upload'],
				params: z.object({
					id: z.coerce.number(),
				}),
				response: {
					200: SuccessfulHttpResponseDefinition(UploadedFileDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
					403: FailedHttpResponseDefinition,
					404: FailedHttpResponseDefinition,
				},
			},
		},
		async (req, reply) => {
			const {id} = req.params;

			const data = await app.prisma.uploadedFile.findUnique({
				where: {id},
				select: {
					id: true,
					src: true,
					name: true,
					size: true,
					type: true,
					createdAt: true,
				},
			});

			if (data == null) return reply.notFound();

			return reply.send({
				ok: true,
				data,
			});
		},
	);

	app.put(
		'/',
		{
			onRequest: [app.csrfProtection],
			preHandler: [app.verifyAuth],
			schema: {
				tags: ['Upload'],
				response: {
					200: SuccessfulHttpResponseDefinition(UploadedFileDefinition),
					400: FailedHttpResponseDefinition,
					401: FailedHttpResponseDefinition,
				},
				consumes: ['multipart/form-data'],
				headers: z.object({
					'x-csrf-token': z.string().nullable().optional(),
				}),
			},
		},
		async (req, reply) => {
			const file = await req.file();

			if (!file) return reply.badRequest();

			const uniqName = `${randomUUID()}${extname(file.filename)}`;

			await pipeline(file.file, createWriteStream(join(process.cwd(), 'src/uploads', uniqName)));

			const name = file.filename;
			const type = file.mimetype;
			const size = file.file.bytesRead;
			const src = `/_uploads/${uniqName}`;

			const data = await app.prisma.uploadedFile.create({
				data: {
					src,
					name,
					size,
					type,
				},
				select: {
					id: true,
					src: true,
					name: true,
					size: true,
					type: true,
					createdAt: true,
				},
			});

			return reply.send({
				ok: true,
				data,
			});
		},
	);
};

export const autoPrefix = '/uploads';
export default plugin;

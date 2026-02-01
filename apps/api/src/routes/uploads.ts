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

			await pipeline(file.file, createWriteStream(join(process.cwd(), 'uploads', uniqName)));

			const name = file.filename;
			const type = file.mimetype;
			const size = file.file.bytesRead;
			const url = `/uploads/${uniqName}`;

			const data = await app.prisma.uploadedFile.create({
				data: {
					url,
					name,
					size,
					type,
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

import autoload from '@fastify/autoload';
import cors from '@fastify/cors';
import csrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import session from '@fastify/secure-session';
import sensible from '@fastify/sensible';
import static_ from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type {FastifyServerOptions} from 'fastify';
import fastify from 'fastify';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod';
import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
	const options: FastifyServerOptions = {
		logger: {
			enabled: process.env.NODE_ENV === 'development',
			transport: {
				target: '@fastify/one-line-logger',
			},
		},
		trustProxy: true,
	};

	try {
		const server = fastify(options);

		server.setValidatorCompiler(validatorCompiler);
		server.setSerializerCompiler(serializerCompiler);

		await server.register(swagger, {
			transform: jsonSchemaTransform,
			openapi: {
				info: {
					title: 'Expense Tracker API',
					description: 'API documentation for the expense tracker app',
					version: '0.0.1',
				},
			},
		});

		await server.register(swaggerUi, {
			routePrefix: '/',
		});

		await server.register(cors, {
			origin: process.env.NODE_ENV === 'development' ? ['http://localhost:3001'] : [],
			methods: ['HEAD', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
			credentials: true,
		});

		await server.register(sensible);

		/* @ts-expect-error */
		await server.register(rateLimit, {
			global: true,
			timeWindow: 1000 * 60,
			max: 100,
			addHeaders: true,
			addHeadersOnExceeding: true,
		});

		await server.register(helmet, {
			global: true,
			crossOriginResourcePolicy: {
				policy: 'cross-origin',
			},
		});

		await server.register(multipart, {
			limits: {
				files: 1,
				fields: 8,
				fileSize: 2_000_000 /* 2MiB */,
			},
		});

		await server.register(session, {
			key: await fs.readFile(
				path.resolve(
					process.env.NODE_ENV === 'production'
						? './session-key.production'
						: './session-key.development',
				),
			),
			cookie: {
				path: '/',
				maxAge: 60 * 60 * 24 /* 1d */,
				secure: process.env.NODE_ENV === 'production',
				domain: process.env.NODE_ENV === 'production' ? 'dts.app' : undefined,
				signed: true,
				sameSite: true,
				httpOnly: true,
			},
		});

		await server.register(csrf, {
			sessionPlugin: '@fastify/secure-session',
		});

		await server.register(autoload, {
			dir: path.join(__dirname, 'plugins'),
			options,
		});

		await server.register(autoload, {
			dir: path.join(__dirname, 'routes'),
			options,
		});

		await server.register(static_, {
			root: path.join(__dirname, 'uploads'),
			index: false,
			prefix: '/uploads',
			maxAge: '90d',
		});

		await server.listen({
			host: process.env.HOST || 'localhost',
			port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

main();

declare module '@fastify/secure-session' {
	interface SessionData {
		account: number;
	}
}

import * as z from 'zod';
import {DateDefinition, IdDefinition} from './common.js';

export type Otp = z.infer<typeof OtpDefinition>;
export const OtpDefinition = z.object({
	id: IdDefinition,
	code: z.string().regex(/[0-9]{6}/),
	email: z.email(),
	expiresAt: DateDefinition,
	createdAt: DateDefinition,
});

export type GenerateOtp = z.infer<typeof OtpDefinition>;
export const GenerateOtpDefinition = z.object({
	ttl: z.number(),
	email: z.email(),
});

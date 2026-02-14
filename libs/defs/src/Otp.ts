import * as z from 'zod';
import {DateDefinition, IdDefinition} from './common.js';

export type Otp = z.infer<typeof OtpDefinition>;
export const OtpDefinition = z.object({
	id: IdDefinition,
	code: z.string(),
	email: z.email(),
	expiresAt: DateDefinition,
	createdAt: DateDefinition,
});

export type GenerateOtpInput = z.infer<typeof GenerateOtpInputDefinition>;
export const GenerateOtpInputDefinition = z.object({
	email: z.email(),
});

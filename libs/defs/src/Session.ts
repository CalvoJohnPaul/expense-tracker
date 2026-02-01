import * as z from 'zod';
import {PasswordDefinition} from './common.js';

export type CreateSessionInput = z.infer<typeof CreateSessionInputDefinition>;
export const CreateSessionInputDefinition = z.object({
	email: z.email(),
	password: PasswordDefinition,
});

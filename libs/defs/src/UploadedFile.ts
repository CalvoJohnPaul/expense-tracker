import * as z from 'zod';
import {DateDefinition, IdDefinition} from './common.js';

export type UploadedFile = z.infer<typeof UploadedFileDefinition>;
export const UploadedFileDefinition = z.object({
	id: IdDefinition,
	url: z.url(),
	type: z.string(),
	size: z.number(),
	name: z.string(),
	createdAt: DateDefinition,
});

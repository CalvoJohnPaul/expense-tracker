import * as z from 'zod';
import {AccountDefinition} from './Account.js';
import {DateDefinition, IdDefinition} from './common.js';

export type AdminActivityType = z.infer<typeof AdminActivityTypeDefinition>;
export const AdminActivityTypeDefinition = z.enum([
	'LOG_IN',

	'CREATE_ADMIN_ACCOUNT',
	'UPDATE_ADMIN_ACCOUNT',
	'DELETE_ADMIN_ACCOUNT',
	'SUSPEND_ADMIN_ACCOUNT',
	'UNSUSPEND_ADMIN_ACCOUNT',

	'CREATE_MEMBER_ACCOUNT',
	'UPDATE_MEMBER_ACCOUNT',
	'DELETE_MEMBER_ACCOUNT',
	'SUSPEND_MEMBER_ACCOUNT',
	'UNSUSPEND_MEMBER_ACCOUNT',
]);

export type AdminActivity = z.infer<typeof AdminActivityDefinition>;
export const AdminActivityDefinition = z.object({
	id: IdDefinition,
	type: AdminActivityTypeDefinition,
	account: AccountDefinition.pick({
		id: true,
		name: true,
	}),
	details: z.unknown(),
	createdAt: DateDefinition,
});

export type AdminActivityAggregate = z.infer<typeof AdminActivityAggregateDefinition>;
export const AdminActivityAggregateDefinition = z.object({
	total: z.number(),
});

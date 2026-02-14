import * as z from 'zod';
import {DateDefinition, IdDefinition, PasswordDefinition, SortOrderDefinition} from './common.js';

export type Permission = z.infer<typeof PermissionDefinition>;
export const PermissionDefinition = z.enum([
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

export type AccountType = z.infer<typeof AccountTypeDefinition>;
export const AccountTypeDefinition = z.enum(['ADMIN', 'MEMBER']);

export type AccountStatus = z.infer<typeof AccountStatusDefinition>;
export const AccountStatusDefinition = z.enum(['ACTIVE', 'SUSPENDED']);

export type Account = z.infer<typeof AccountDefinition>;
export const AccountDefinition = z.object({
	id: IdDefinition,
	type: AccountTypeDefinition,
	name: z.string().trim().min(4, 'Name too short').max(50, 'Name too long'),
	email: z.email().max(150, 'Email too long'),
	avatar: z.url().nullable().optional(),
	status: AccountStatusDefinition,
	createdAt: DateDefinition,
	updatedAt: DateDefinition,
	permissions: z.array(PermissionDefinition),
});

export type CreateAccountInput = z.infer<typeof CreateAccountInputDefinition>;
export const CreateAccountInputDefinition = AccountDefinition.pick({
	type: true,
	name: true,
	email: true,
	avatar: true,
	permissions: true,
}).extend({
	password: PasswordDefinition,
});

export type UpdateAccountDataInput = z.infer<typeof UpdateAccountDataInputDefinition>;
export const UpdateAccountDataInputDefinition = z.object({
	name: CreateAccountInputDefinition.shape.name.optional().or(z.literal('')),
	email: CreateAccountInputDefinition.shape.email.optional().or(z.literal('')),
	avatar: CreateAccountInputDefinition.shape.avatar.optional().or(z.literal('')),
	password: CreateAccountInputDefinition.shape.password.optional().or(z.literal('')),
	permissions: CreateAccountInputDefinition.shape.permissions.optional(),
});

export type UpdateAccountInput = z.infer<typeof UpdateAccountInputDefinition>;
export const UpdateAccountInputDefinition = z.object({
	id: IdDefinition,
	data: UpdateAccountDataInputDefinition,
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordInputDefinition>;
export const ChangePasswordInputDefinition = z.object({
	oldPassword: PasswordDefinition,
	newPassword: PasswordDefinition,
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordInputDefinition>;
export const ResetPasswordInputDefinition = z.object({
	newPassword: PasswordDefinition,
	otpCode: z.string().regex(/[0-9A-Z]{6}/, 'Invalid OTP code'),
});

export type AccountAggregate = z.infer<typeof AccountAggregateDefinition>;
export const AccountAggregateDefinition = z.object({
	total: z.number(),
});

export type AccountSortColumnInput = z.infer<typeof AccountSortColumnInputDefinition>;
export const AccountSortColumnInputDefinition = z.enum(['CREATED_AT', 'UPDATED_AT']);

export type AccountSortInput = z.infer<typeof AccountSortInputDefinition>;
export const AccountSortInputDefinition = z.object({
	column: AccountSortColumnInputDefinition,
	order: SortOrderDefinition,
});

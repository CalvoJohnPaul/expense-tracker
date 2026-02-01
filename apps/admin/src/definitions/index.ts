import {
	AccountSortInputDefinition,
	AccountStatusDefinition,
	AccountTypeDefinition,
	AdminActivityTypeDefinition,
	DateDefinition,
	ExpenseCategoryDefinition,
	ExpenseSortInputDefinition,
} from '@expense-tracker/defs';
import * as z from 'zod';

export type DateRange = z.infer<typeof DateRangeDefinition>;
export const DateRangeDefinition = z.object({
	from: z.date().nullable().optional(),
	to: z.date().nullable().optional(),
});

export type NumberRange = z.infer<typeof NumberRangeDefinition>;
export const NumberRangeDefinition = z.object({
	from: z.number().nullable().optional(),
	to: z.number().nullable().optional(),
});

export type DateRangePreset = z.infer<typeof DateRangePresetDefinition>;
export const DateRangePresetDefinition = z.enum([
	'THIS_YEAR',
	'LAST_YEAR',
	'THIS_MONTH',
	'LAST_MONTH',
	'THIS_WEEK',
	'LAST_WEEK',
]);

export type Option = z.infer<typeof OptionDefinition>;
export const OptionDefinition = z.object({
	label: z.string().trim().min(1),
	value: z.string().trim().min(1),
	disabled: z.boolean().optional(),
});

export type IdFilterInput = z.infer<typeof IdFilterInputDefinition>;
export const IdFilterInputDefinition = z.object({
	eq: z.number().optional().nullable(),
	neq: z.number().optional().nullable(),
	in: z.array(z.number()).optional().nullable(),
	nin: z.array(z.number()).optional().nullable(),
});

export type StringFilterInput = z.infer<typeof StringFilterInputDefinition>;
export const StringFilterInputDefinition = z.object({
	eq: z.string().optional().nullable(),
	neq: z.string().optional().nullable(),
	in: z.array(z.string()).optional().nullable(),
	nin: z.array(z.string()).optional().nullable(),
	contains: z.string().optional().nullable(),
});

export type NumberFilterInput = z.infer<typeof NumberFilterInputDefinition>;
export const NumberFilterInputDefinition = z.object({
	gt: z.number().nullable().optional(),
	gte: z.number().nullable().optional(),
	lt: z.number().nullable().optional(),
	lte: z.number().nullable().optional(),
});

export type BooleanFilterInput = z.infer<typeof BooleanFilterInputDefinition>;
export const BooleanFilterInputDefinition = z.object({
	eq: z.boolean().nullable().optional(),
	neq: z.boolean().nullable().optional(),
});

export type DateFilterInput = z.infer<typeof DateFilterInputDefinition>;
export const DateFilterInputDefinition = z.object({
	gt: DateDefinition.nullable().optional(),
	gte: DateDefinition.nullable().optional(),
	lt: DateDefinition.nullable().optional(),
	lte: DateDefinition.nullable().optional(),
});

export type EnumFilterInput<T> = z.infer<
	ReturnType<typeof EnumFilterInputDefinition<z.ZodType<T>>>
>;
export const EnumFilterInputDefinition = <T extends z.ZodType>(def: T) =>
	z.object({
		eq: def.optional().nullable(),
		neq: def.optional().nullable(),
		in: z.array(def).optional().nullable(),
		nin: z.array(def).optional().nullable(),
	});

export type PaginationInput = z.infer<typeof PaginationInputDefinition>;
export const PaginationInputDefinition = z.object({
	page: z.number().optional().nullable(),
	pageSize: z.number().optional().nullable(),
});

export type ExpenseFilterInput = z.infer<typeof ExpenseFilterInputDefinition>;
export const ExpenseFilterInputDefinition = z.object({
	amount: NumberFilterInputDefinition.optional().nullable(),
	category: EnumFilterInputDefinition(ExpenseCategoryDefinition).optional().nullable(),
	location: StringFilterInputDefinition.optional().nullable(),
	transactionDate: DateFilterInputDefinition.optional().nullable(),
	createdAt: DateFilterInputDefinition.optional().nullable(),
	updatedAt: DateFilterInputDefinition.optional().nullable(),
});

export type ExpenseInput = z.infer<typeof ExpenseInputDefinition>;
export const ExpenseInputDefinition = PaginationInputDefinition.extend({
	filter: ExpenseFilterInputDefinition.optional().nullable(),
	sort: ExpenseSortInputDefinition.optional().nullable(),
});

export type AccountFilterInput = z.infer<typeof AccountFilterInputDefinition>;
export const AccountFilterInputDefinition = z.object({
	id: IdFilterInputDefinition.optional().nullable(),
	type: EnumFilterInputDefinition(AccountTypeDefinition).optional().nullable(),
	name: StringFilterInputDefinition.optional().nullable(),
	email: StringFilterInputDefinition.optional().nullable(),
	status: EnumFilterInputDefinition(AccountStatusDefinition).optional().nullable(),
	createdAt: DateFilterInputDefinition.optional().nullable(),
	updatedAt: DateFilterInputDefinition.optional().nullable(),
});

export type AccountInput = z.infer<typeof AccountInputDefinition>;
export const AccountInputDefinition = PaginationInputDefinition.extend({
	filter: AccountFilterInputDefinition.optional().nullable(),
	sort: AccountSortInputDefinition.optional().nullable(),
});

export type AdminActivityFilterInput = z.infer<typeof AdminActivityFilterInputDefinition>;
export const AdminActivityFilterInputDefinition = z.object({
	type: EnumFilterInputDefinition(AdminActivityTypeDefinition).optional().nullable(),
	account: IdFilterInputDefinition.optional().nullable(),
});

export type AdminActivityInput = z.infer<typeof AdminActivityInputDefinition>;
export const AdminActivityInputDefinition = PaginationInputDefinition.extend({
	filter: AdminActivityFilterInputDefinition.optional().nullable(),
});

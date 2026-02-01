import * as z from 'zod';
import {DateDefinition, IdDefinition, SortOrderDefinition} from './common.js';

export type ExpenseCategory = z.infer<typeof ExpenseCategoryDefinition>;
export const ExpenseCategoryDefinition = z.enum([
	'HOUSING',
	'UTILITIES',
	'TRANSPORTATION',
	'FOOD',
	'INSURANCE',
	'HEALTHCARE',
	'DEBT_PAYMENT',
	'PERSONAL_CARE',
	'ENTERTAINMENT',
	'SAVINGS',
	'EDUCATION',
	'CLOTHING',
	'MISCELLANEOUS',
	'OTHERS',
]);

export type Expense = z.infer<typeof ExpenseDefinition>;
export const ExpenseDefinition = z.object({
	id: IdDefinition,
	amount: z.number(),
	category: ExpenseCategoryDefinition,
	description: z.string().trim().min(1, 'Description is required'),
	transactionDate: DateDefinition,
	location: z.string().nullable().optional(),
	createdAt: DateDefinition,
	updatedAt: DateDefinition,
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseInputDefinition>;
export const CreateExpenseInputDefinition = ExpenseDefinition.pick({
	amount: true,
	category: true,
	location: true,
	description: true,
	transactionDate: true,
});

export type UpdateExpenseDataInput = z.infer<typeof UpdateExpenseDataInputDefinition>;
export const UpdateExpenseDataInputDefinition = z.object({
	amount: CreateExpenseInputDefinition.shape.amount.optional(),
	category: CreateExpenseInputDefinition.shape.category.optional(),
	location: CreateExpenseInputDefinition.shape.location.optional().or(z.literal('')),
	description: CreateExpenseInputDefinition.shape.description.optional().or(z.literal('')),
	transactionDate: CreateExpenseInputDefinition.shape.transactionDate.optional(),
});

export type UpdateExpenseInput = z.infer<typeof UpdateExpenseInputDefinition>;
export const UpdateExpenseInputDefinition = z.object({
	id: IdDefinition,
	data: UpdateExpenseDataInputDefinition,
});

export type ExpenseAggregate = z.infer<typeof ExpenseAggregateDefinition>;
export const ExpenseAggregateDefinition = z.object({
	amount: z.number(),
	total: z.number(),
});

export type ExpenseSortColumnInput = z.infer<typeof ExpenseSortColumnInputDefinition>;
export const ExpenseSortColumnInputDefinition = z.enum([
	'AMOUNT',
	'TRANSACTION_DATE',
	'CREATED_AT',
	'UPDATED_AT',
]);

export type ExpenseSortInput = z.infer<typeof ExpenseSortInputDefinition>;
export const ExpenseSortInputDefinition = z.object({
	column: ExpenseSortColumnInputDefinition,
	order: SortOrderDefinition,
});

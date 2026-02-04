import * as z from 'zod';
import {ExpenseCategoryDefinition} from './Expense.js';

export type ChartData = z.infer<typeof ChartDataDefinition>;
export const ChartDataDefinition = z.object({
	totalExpenses: z.number(),
	totalExpensesThisMonth: z.number(),
	totalExpensesLastMonth: z.number(),
	totalExpensesThisYear: z.number(),
	totalExpensesLastYear: z.number(),
	totalExpensesPerCategory: z.partialRecord(ExpenseCategoryDefinition, z.number()),
	yearOverYearPercentChange: z.number(),
	monthOverMonthPercentChange: z.number(),
	averageDailySpend: z.number(),
});

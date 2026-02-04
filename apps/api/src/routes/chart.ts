import {
	ChartDataDefinition,
	SuccessfulHttpResponseDefinition,
	type ExpenseCategory,
} from '@expense-tracker/defs';
import {
	endOfMonth,
	endOfYear,
	getDaysInYear,
	startOfMonth,
	startOfYear,
	subMonths,
	subYears,
} from 'date-fns';
import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod';

const plugin: FastifyPluginAsyncZod = async (app) => {
	app.get(
		'/',
		{
			preHandler: [app.verifyMember],
			schema: {
				tags: ['Chart'],
				response: {
					200: SuccessfulHttpResponseDefinition(ChartDataDefinition),
				},
			},
		},
		async (req, reply) => {
			const accountId = req.account.id;

			const now = new Date();
			const lastMonth = subMonths(now, 1);
			const lastYear = subYears(now, 1);
			const startOfThisMonth = startOfMonth(now);
			const endOfThisMonth = endOfMonth(now);
			const startOfLastMonth = startOfMonth(lastMonth);
			const endOfLastMonth = endOfMonth(lastMonth);
			const startOfThisYear = startOfYear(now);
			const endOfThisYear = endOfYear(now);
			const startOfLastYear = startOfYear(lastYear);
			const endOfLastYear = endOfYear(lastYear);

			const [
				$totalExpenses,
				$totalExpensesPerCategory,
				$totalExpensesThisMonth,
				$totalExpensesLastMonth,
				$totalExpensesThisYear,
				$totalExpensesLastYear,
				$averageDailySpend,
			] = await app.prisma.$transaction([
				app.prisma.expense.aggregate({
					_sum: {amount: true},
					where: {
						accountId,
						transactionDate: {
							gte: startOfThisYear,
							lte: endOfThisYear,
						},
					},
				}),
				app.prisma.expense.groupBy({
					by: ['category'],
					_sum: {amount: true},
					orderBy: {_sum: {amount: 'desc'}},
					where: {
						accountId,
						transactionDate: {
							gte: startOfThisYear,
							lte: endOfThisYear,
						},
					},
				}),
				app.prisma.expense.aggregate({
					_sum: {amount: true},
					where: {
						accountId,
						transactionDate: {
							gte: startOfThisMonth,
							lte: endOfThisMonth,
						},
					},
				}),
				app.prisma.expense.aggregate({
					_sum: {amount: true},
					where: {
						accountId,
						transactionDate: {
							gte: startOfLastMonth,
							lte: endOfLastMonth,
						},
					},
				}),
				app.prisma.expense.aggregate({
					_sum: {amount: true},
					where: {
						accountId,
						transactionDate: {
							gte: startOfThisYear,
							lte: endOfThisYear,
						},
					},
				}),
				app.prisma.expense.aggregate({
					_sum: {amount: true},
					where: {
						accountId,
						transactionDate: {
							gte: startOfLastYear,
							lte: endOfLastYear,
						},
					},
				}),
				app.prisma.expense.aggregate({
					where: {
						accountId,
						transactionDate: {
							gte: startOfThisYear,
							lte: endOfThisYear,
						},
					},
					_sum: {
						amount: true,
					},
				}),
			]);

			const totalExpenses = $totalExpenses._sum.amount ?? 0;
			const totalExpensesThisMonth = $totalExpensesThisMonth._sum.amount ?? 0;
			const totalExpensesLastMonth = $totalExpensesLastMonth._sum.amount ?? 0;
			const monthOverMonthPercentChange = calculatePercentChange(
				totalExpensesThisMonth,
				totalExpensesLastMonth,
			);
			const totalExpensesThisYear = $totalExpensesThisYear._sum.amount ?? 0;
			const totalExpensesLastYear = $totalExpensesLastYear._sum.amount ?? 0;
			const yearOverYearPercentChange = calculatePercentChange(
				totalExpensesThisYear,
				totalExpensesLastYear,
			);
			const totalExpensesPerCategory = $totalExpensesPerCategory.reduce<
				Partial<Record<ExpenseCategory, number>>
			>((acc, item) => {
				acc[item.category] = item._sum.amount ?? 0;
				return acc;
			}, {});
			const averageDailySpend = ($averageDailySpend._sum.amount ?? 0) / getDaysInYear(now);

			return reply.send({
				ok: true,
				data: {
					totalExpenses,
					totalExpensesPerCategory,
					totalExpensesThisMonth,
					totalExpensesLastMonth,
					totalExpensesThisYear,
					totalExpensesLastYear,
					monthOverMonthPercentChange,
					yearOverYearPercentChange,
					averageDailySpend,
				},
			});
		},
	);
};

function calculatePercentChange(current: number, previous: number): number {
	if (previous === 0) return current === 0 ? 0 : 100;
	return ((current - previous) / previous) * 100;
}

export const autoPrefix = '/chart';
export default plugin;

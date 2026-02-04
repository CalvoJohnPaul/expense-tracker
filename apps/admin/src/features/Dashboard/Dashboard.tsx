import {createListCollection} from '@ark-ui/react';
import type {ExpenseCategory} from '@expense-tracker/defs';
import {format} from 'date-fns';
import {map} from 'es-toolkit/compat';
import {TrendingDownIcon, TrendingUpIcon} from 'lucide-react';
import {Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {DataTable} from '~/components/DataTable';
import {protected_} from '~/components/Protected';
import {Badge} from '~/components/ui/Badge';
import {Stat} from '~/components/ui/Stat';
import {useChartQuery} from '~/hooks/useChartQuery';
import {useExpensesQuery} from '~/hooks/useExpensesQuery';
import {tw} from '~/utils/tw';

export const Dashboard = protected_(
	() => {
		return (
			<>
				<div className="mb-8">
					<h1 className="font-bold text-3xl">Dashboard</h1>
					<p className="text-neutral-300">Overview of your spending activity</p>
				</div>

				<div className="space-y-6">
					<Status />
					<TotalExpensesPerCategory />
					<RecentExpenses />
				</div>
			</>
		);
	},
	{
		type: 'MEMBER',
	},
);

function Status() {
	const query = useChartQuery();

	return (
		<div className="grid grid-cols-4 gap-4">
			<div className="rounded-xl border p-4">
				<Stat.Root>
					<Stat.Label>Total Expenses</Stat.Label>
					<Stat.ValueText>{numberFormatter.format(query.data?.totalExpenses ?? 0)}</Stat.ValueText>
				</Stat.Root>
			</div>
			<div className="rounded-xl border p-4">
				<Stat.Root>
					<Stat.Label>Average Daily Spend</Stat.Label>
					<Stat.ValueText>
						{numberFormatter.format(query.data?.averageDailySpend ?? 0)}
					</Stat.ValueText>
				</Stat.Root>
			</div>
			<div className="rounded-xl border p-4">
				<Stat.Root>
					<Stat.Label>This Month vs Last Month</Stat.Label>
					<Stat.ValueText className="">
						{numberFormatter.format(query.data?.totalExpensesThisMonth ?? 0)}
					</Stat.ValueText>
					<Stat.DownIndicator>
						<TrendingDownIcon />{' '}
						{numberFormatter.format(query.data?.monthOverMonthPercentChange ?? 0)}% from previous
					</Stat.DownIndicator>
				</Stat.Root>
			</div>
			<div className="rounded-xl border p-4">
				<Stat.Root>
					<Stat.Label>This Year vs Last Year</Stat.Label>
					<Stat.ValueText>
						{numberFormatter.format(query.data?.totalExpensesThisYear ?? 0)}
					</Stat.ValueText>
					<Stat.UpIndicator>
						<TrendingUpIcon /> {numberFormatter.format(query.data?.yearOverYearPercentChange ?? 0)}%
						from previous
					</Stat.UpIndicator>
				</Stat.Root>
			</div>
		</div>
	);
}

function RecentExpenses() {
	const query = useExpensesQuery({
		pageSize: 10,
		sort: {
			column: 'CREATED_AT',
			order: 'DESC',
		},
	});

	return (
		<div>
			<div className="mb-4">
				<h2 className="font-medium text-sm">Recent Expenses</h2>
				<p className="text-neutral-300 text-xs">Your latest recorded transactions</p>
			</div>

			<DataTable
				id="recent-expenses"
				collection={createListCollection({
					items: query.data?.rows ?? [],
					itemToString: (item) => `${item.category} ${item.amount}`,
					itemToValue: (item) => item.id.toString(),
				})}
				columns={[
					{
						id: 'category',
						heading: 'Category',
						cell(data) {
							return (
								<Badge.Root
									accent={
										data.category === 'CLOTHING' || data.category === 'ENTERTAINMENT'
											? 'danger'
											: data.category === 'DEBT_PAYMENT' ||
													data.category === 'EDUCATION' ||
													data.category === 'HOUSING' ||
													data.category === 'HEALTHCARE' ||
													data.category === 'SAVINGS' ||
													data.category === 'INSURANCE'
												? 'primary'
												: data.category === 'PERSONAL_CARE' ||
														data.category === 'TRANSPORTATION' ||
														data.category === 'FOOD'
													? 'warning'
													: 'info'
									}
								>
									<Badge.Label>{data.category.replace(/_/g, ' ')}</Badge.Label>
								</Badge.Root>
							);
						},

						className: {
							cell: tw`w-64`,
						},
					},
					{
						id: 'transactionDate',
						heading: 'Transaction date',
						cell(data) {
							return format(data.transactionDate, 'dd MMM yyyy');
						},
					},
					{
						id: 'location',
						heading: 'Location',
						cell(data) {
							return (
								<span title={data.location ?? ''} className="max-w-96 truncate">
									{data.location}
								</span>
							);
						},
					},
					{
						id: 'amount',
						heading: 'Amount',
						cell(data) {
							return new Intl.NumberFormat('en-US', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							}).format(data.amount);
						},
						numeric: true,
						className: {
							cell: tw`w-48`,
						},
					},
					{
						id: 'createdAt',
						heading: 'Created date & time',
						cell(data) {
							return format(data.createdAt, 'dd MMM yyyy hh:mm a');
						},
						className: {
							cell: tw`w-56 tabular-nums`,
						},
					},
				]}
			/>
		</div>
	);
}

function TotalExpensesPerCategory() {
	const query = useChartQuery();

	const data = query.data
		? map(query.data.totalExpensesPerCategory, (v, k) => ({
				category: k.replace(/_/g, ' '),
				total: v ?? 0,
			}))
		: [];

	const CATEGORY_COLORS: Record<string, string> = {
		DEBT_PAYMENT: 'var(--color-emerald-700)',
		EDUCATION: 'var(--color-emerald-700)',
		HOUSING: 'var(--color-emerald-700)',
		HEALTHCARE: 'var(--color-emerald-700)',
		SAVINGS: 'var(--color-emerald-700)',
		INSURANCE: 'var(--color-emerald-700)',
		CLOTHING: 'var(--color-rose-700)',
		ENTERTAINMENT: 'var(--color-rose-700)',
		PERSONAL_CARE: 'var(--color-amber-700)',
		TRANSPORTATION: 'var(--color-amber-700)',
		FOOD: 'var(--color-amber-700)',
		MISCELLANEOUS: 'var(--color-blue-700)',
		UTILITIES: 'var(--color-blue-700)',
		OTHERS: 'var(--color-blue-700)',
	} satisfies Record<ExpenseCategory, string>;

	return (
		<div>
			<div className="mb-4">
				<h2 className="font-medium text-sm">Expenses by Category</h2>
				<p className="text-neutral-300 text-xs">Breakdown of your expenses by category</p>
			</div>

			<div className="rounded-xl border p-4 pt-6">
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data}>
							<XAxis
								dataKey="category"
								fontSize={12}
								tick={false}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								fontSize={12}
								tick={{
									fill: 'var(--color-neutral-500)',
								}}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip
								formatter={(value) => value?.toLocaleString('en-US')}
								contentStyle={{
									color: 'var(--color-neutral-400)',
									background: 'var(--color-neutral-800)',
									borderColor: 'var(--color-neutral-700)',
									borderRadius: 'var(--radius-sm)',
									padding: '0.75rem 1rem',
									fontSize: '0.75rem',
								}}
								itemStyle={{
									color: 'var(--color-neutral-200)',
									fontSize: '1rem',
								}}
								cursor={false}
							/>
							<Bar
								dataKey="total"
								background={{
									fill: 'var(--color-neutral-800)',
									fillOpacity: 0.35,
								}}
							>
								{data.map((entry) => (
									<Cell
										key={entry.category}
										fill={CATEGORY_COLORS[entry.category.replace(/\s/g, '_')]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

const numberFormatter = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 2,
	minimumFractionDigits: 1,
});

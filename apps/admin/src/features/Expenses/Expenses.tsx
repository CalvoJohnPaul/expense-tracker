import {createListCollection, Portal, Presence} from '@ark-ui/react';
import {
	ExpenseCategoryDefinition,
	ExpenseSortColumnInputDefinition,
	SortOrderDefinition,
	type ExpenseSortColumnInput,
} from '@expense-tracker/defs';
import {format} from 'date-fns';
import {CheckIcon, SettingsIcon} from 'lucide-react';
import {
	parseAsFloat,
	parseAsInteger,
	parseAsIsoDate,
	parseAsNativeArrayOf,
	parseAsString,
	parseAsStringLiteral,
	useQueryStates,
} from 'nuqs';
import {useState} from 'react';
import * as z from 'zod';
import {DataTable} from '~/components/DataTable';
import {protected_} from '~/components/Protected';
import {Badge} from '~/components/ui/Badge';
import {Menu} from '~/components/ui/Menu';
import type {ExpenseFilterInput} from '~/definitions';
import {useExpenseAggregateQuery} from '~/hooks/useExpenseAggregateQuery';
import {useExpensesQuery} from '~/hooks/useExpensesQuery';
import {tw} from '~/utils/tw';
import {BulkDeleteExpense} from './BulkDeleteExpense';
import {CreateExpense} from './CreateExpense';
import {DeleteExpense} from './DeleteExpense';
import {EditExpense} from './EditExpense';
import {ExpenseProvider, FilterProvider} from './ExpensesContext';
import {ExportExpenses} from './ExportExpenses';
import {ViewExpense} from './ViewExpense';

export const Expenses = protected_(
	() => {
		const [state, setState] = useQueryStates({
			page: parseAsInteger.withDefault(1),
			pageSize: parseAsInteger.withDefault(10),
			category: parseAsNativeArrayOf(parseAsStringLiteral(ExpenseCategoryDefinition.options)),
			location: parseAsString,
			transactionDate__from: parseAsIsoDate,
			transactionDate__to: parseAsIsoDate,
			amount__from: parseAsFloat,
			amount__to: parseAsFloat,
			createdAt__from: parseAsIsoDate,
			createdAt__to: parseAsIsoDate,
			sortBy: parseAsStringLiteral(ExpenseSortColumnInputDefinition.options)
				.withDefault('CREATED_AT')
				.withOptions({
					clearOnDefault: false,
				}),
			sortOrder: parseAsStringLiteral(SortOrderDefinition.options).withDefault('DESC').withOptions({
				clearOnDefault: false,
			}),
		});

		const filter: ExpenseFilterInput = {
			...((state.amount__from || state.amount__to) && {
				amount: {
					gte: state.amount__from,
					lte: state.amount__to,
				},
			}),
			...(state.category.length && {
				category: {
					in: state.category,
				},
			}),
			...(state.location && {
				location: {
					eq: state.location,
				},
			}),
			...((state.createdAt__from || state.createdAt__to) && {
				createdAt: {
					gte: state.createdAt__from,
					lte: state.createdAt__to,
				},
			}),
			...((state.transactionDate__from || state.transactionDate__to) && {
				transactionDate: {
					gte: state.transactionDate__from,
					lte: state.transactionDate__to,
				},
			}),
		};

		const expenseAggregateQuery = useExpenseAggregateQuery(filter);
		const expensesQuery = useExpensesQuery({
			page: state.page,
			pageSize: state.pageSize,
			filter,
			...(state.sortBy && {
				sort: {
					column: state.sortBy,
					order: state.sortOrder,
				},
			}),
		});

		const [checked, setChecked] = useState<string[]>([]);

		return (
			<div>
				<div className="mb-8 flex items-center gap-3">
					<div>
						<h1 className="font-bold text-3xl">Expenses</h1>
						<p className="text-neutral-300">Manage your expenses</p>
					</div>
					<div className="grow" />

					<Presence
						present={checked.length > 0}
						className="ui-closed:animate-fade-out ui-open:animate-fade-in"
					>
						<BulkDeleteExpense
							ids={z.array(z.coerce.number()).parse(checked)}
							onDeleted={() => {
								setChecked([]);
							}}
						/>
					</Presence>
					<CreateExpense />
					<FilterProvider value={filter}>
						<ExportExpenses />
					</FilterProvider>
				</div>

				<DataTable
					id="expenses"
					collection={createListCollection({
						items: expensesQuery.data?.rows ?? [],
						itemToValue: (item) => item.id.toString(),
						itemToString: (item) => item.id.toString(),
					})}
					columns={[
						{
							id: 'category',
							heading: 'Category',
							cell(data) {
								return (
									<div className="flex w-full items-center gap-3">
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
										<div className="grow" />
										<ExpenseProvider value={data}>
											<ViewExpense />
										</ExpenseProvider>
									</div>
								);
							},
							filter: {
								type: 'SELECT',
								options: ExpenseCategoryDefinition.options.map((value) => ({
									value,
									label: value.replace(/_/g, ' '),
								})),
								multiple: true,
								value: state.category,
								onChange(value) {
									setState({category: z.array(ExpenseCategoryDefinition).parse(value)});
								},
								placeholder: 'Select category',
							},
							className: {
								cell: tw`w-64`,
							},
						},
						{
							id: 'description',
							heading: 'Description',
							cell(data) {
								return <span className="w-96 truncate">{data.description}</span>;
							},
							orderable: true,
							hideable: true,
						},
						{
							id: 'transactionDate',
							heading: 'Transaction date',
							cell(data) {
								return format(data.transactionDate, 'dd MMM yyyy');
							},
							sortable: true,
							hideable: true,
							orderable: true,
							filter: {
								type: 'DATE_RANGE',
								value: {
									from: state.transactionDate__from,
									to: state.transactionDate__to,
								},
								onChange(value) {
									setState({
										transactionDate__from: value?.from,
										transactionDate__to: value?.to,
									});
								},
								placeholder: 'Select transaction date',
							},
							className: {
								cell: tw`w-48 tabular-nums`,
							},
						},
						{
							id: 'location',
							heading: 'Location',
							cell(data) {
								return (
									<span title={data.location ?? ''} className="w-96 truncate">
										{data.location}
									</span>
								);
							},
							hideable: true,
							orderable: true,
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
							summary() {
								const amount = expenseAggregateQuery.data?.amount ?? 0;

								return new Intl.NumberFormat('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								}).format(amount);
							},
							numeric: true,
							sortable: true,
							hideable: true,
							orderable: true,
							filter: {
								type: 'NUMBER_RANGE',
								value: {
									from: state.amount__from,
									to: state.amount__to,
								},
								onChange(value) {
									setState({
										amount__from: value?.from,
										amount__to: value?.to,
									});
								},
							},
							className: {
								cell: tw`w-48`,
							},
						},
						{
							id: 'receipt',
							heading: 'Receipt',
							cell(data) {
								if (data.receipt != null) {
									return <CheckIcon className="mx-auto size-4 text-emerald-300" />;
								}
							},
							hideable: true,
							orderable: true,
							className: tw`w-0`,
						},
						{
							id: 'createdAt',
							heading: 'Created date & time',
							cell(data) {
								return format(data.createdAt, 'dd MMM yyyy hh:mm a');
							},
							sortable: true,
							hideable: true,
							orderable: true,
							filter: {
								type: 'DATE_RANGE',
								value: {
									from: state.createdAt__from,
									to: state.createdAt__to,
								},
								onChange(value) {
									setState({
										createdAt__from: value?.from,
										createdAt__to: value?.to,
									});
								},
								placeholder: 'Select craeted date & time',
							},
							className: {
								cell: tw`w-56 tabular-nums`,
							},
						},
						{
							id: 'actions',
							heading: <SettingsIcon className="size-5" />,
							cell(data) {
								return (
									<Menu.Root positioning={{placement: 'bottom-end'}}>
										<Menu.Trigger>
											<SettingsIcon className="size-5" />
										</Menu.Trigger>
										<Portal>
											<Menu.Positioner>
												<Menu.Content>
													<ExpenseProvider value={data}>
														<EditExpense />
														<DeleteExpense />
													</ExpenseProvider>
												</Menu.Content>
											</Menu.Positioner>
										</Portal>
									</Menu.Root>
								);
							},
							className: tw`w-0`,
						},
					]}
					total={expenseAggregateQuery.data?.total}
					page={state.page}
					onPageChange={(page) => setState({page})}
					pageSize={state.pageSize}
					onPageSizeChange={(pageSize) => setState({pageSize})}
					paginationEnabled
					checkEnabled
					checked={checked}
					onCheckedChange={setChecked}
					sortColumn={
						state.sortBy == null
							? INPUT_SORT_COLUMN_MAP.CREATED_AT
							: INPUT_SORT_COLUMN_MAP[state.sortBy]
					}
					onSortColumnChange={(value) => {
						setState({
							page: 1,
							sortBy: value == null ? 'CREATED_AT' : SORT_COLUMN_INPUT_MAP[value],
						});
					}}
					sortOrder={state.sortOrder}
					onSortOrderChange={(value) =>
						setState({
							page: 1,
							sortOrder: value ?? 'DESC',
						})
					}
					loading={expensesQuery.isLoading}
					onReload={async () => {
						expensesQuery.refetch();
						expenseAggregateQuery.refetch();
					}}
					cta={<CreateExpense />}
				/>
			</div>
		);
	},
	{
		type: 'MEMBER',
	},
);

const INPUT_SORT_COLUMN_MAP: Record<ExpenseSortColumnInput, string> = {
	AMOUNT: 'amount',
	CREATED_AT: 'createdAt',
	UPDATED_AT: 'updatedAt',
	TRANSACTION_DATE: 'transactionDate',
};

const SORT_COLUMN_INPUT_MAP: Record<string, ExpenseSortColumnInput> = {
	amount: 'AMOUNT',
	createdAt: 'CREATED_AT',
	updatedAt: 'UPDATED_AT',
	transactionDate: 'TRANSACTION_DATE',
};

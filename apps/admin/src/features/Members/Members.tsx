import {createListCollection, Portal, Presence} from '@ark-ui/react';
import {
	AccountSortColumnInputDefinition,
	AccountStatusDefinition,
	SortOrderDefinition,
	type AccountSortColumnInput,
} from '@expense-tracker/defs';
import {format} from 'date-fns';
import {SettingsIcon} from 'lucide-react';
import {
	parseAsInteger,
	parseAsIsoDate,
	parseAsNativeArrayOf,
	parseAsString,
	parseAsStringLiteral,
	useQueryStates,
} from 'nuqs';
import {useState} from 'react';
import z from 'zod';
import {DataTable} from '~/components/DataTable';
import {protected_} from '~/components/Protected';
import {Badge} from '~/components/ui/Badge';
import {Menu} from '~/components/ui/Menu';
import type {AccountFilterInput} from '~/definitions';
import {useAccessValidator} from '~/hooks/useAccessValidator';
import {useAccountAggregateQuery} from '~/hooks/useAccountAggregateQuery';
import {useAccountsQuery} from '~/hooks/useAccountsQuery';
import {tw} from '~/utils/tw';
import {BulkDeleteMember} from './BulkDeleteMember';
import {BulkSuspendMember} from './BulkSuspendMember';
import {BulkUnsuspendMember} from './BulkUnsuspendMember';
import {CreateMember} from './CreateMember';
import {DeleteMember} from './DeleteMember';
import {EditMember} from './EditMember';
import {MemberProvider} from './MembersContext';
import {SuspendMember} from './SuspendMember';
import {UnsuspendMember} from './UnsuspendMember';
import {ViewMember} from './ViewMember';

export const Members = protected_(
	() => {
		const accessValidator = useAccessValidator();

		const [state, setState] = useQueryStates({
			page: parseAsInteger.withDefault(1),
			pageSize: parseAsInteger.withDefault(10),
			search: parseAsString,
			status: parseAsNativeArrayOf(parseAsStringLiteral(AccountStatusDefinition.options)),
			createdAt__from: parseAsIsoDate,
			createdAt__to: parseAsIsoDate,
			updatedAt__from: parseAsIsoDate,
			updatedAt__to: parseAsIsoDate,
			sortBy: parseAsStringLiteral(AccountSortColumnInputDefinition.options)
				.withDefault('CREATED_AT')
				.withOptions({
					clearOnDefault: false,
				}),
			sortOrder: parseAsStringLiteral(SortOrderDefinition.options).withDefault('DESC').withOptions({
				clearOnDefault: false,
			}),
		});

		const filter: AccountFilterInput = {
			type: {
				eq: 'MEMBER',
			},
			...(state.search && {
				name: {
					contains: state.search,
				},
			}),
			...(state.search && {
				email: {
					contains: state.search,
				},
			}),
			...(state.status.length && {
				status: {
					in: state.status,
				},
			}),
			...((state.createdAt__from || state.createdAt__to) && {
				createdAt: {
					gte: state.createdAt__from,
					lte: state.createdAt__to,
				},
			}),
			...((state.updatedAt__from || state.updatedAt__to) && {
				updatedAt: {
					gte: state.updatedAt__from,
					lte: state.updatedAt__to,
				},
			}),
		};

		const query = useAccountsQuery({
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

		const aggregatesQuery = useAccountAggregateQuery(filter);

		const [checked, setChecked] = useState<string[]>([]);

		return (
			<div>
				<div className="mb-8 flex items-center gap-3">
					<div>
						<h1 className="font-bold text-3xl">Members</h1>
						<p className="text-neutral-300">Manage member accounts</p>
					</div>
					<div className="grow" />

					{accessValidator.permission.hasOneOf([
						'SUSPEND_MEMBER_ACCOUNT',
						'UNSUSPEND_MEMBER_ACCOUNT',
						'DELETE_MEMBER_ACCOUNT',
					]) && (
						<Presence
							present={checked.length > 0}
							className="flex ui-closed:animate-fade-out ui-open:animate-fade-in gap-3"
						>
							{accessValidator.permission.has('SUSPEND_MEMBER_ACCOUNT') && (
								<BulkSuspendMember
									ids={z.array(z.coerce.number()).parse(checked)}
									onSuspended={() => setChecked([])}
								/>
							)}
							{accessValidator.permission.has('UNSUSPEND_MEMBER_ACCOUNT') && (
								<BulkUnsuspendMember
									ids={z.array(z.coerce.number()).parse(checked)}
									onUnsuspended={() => setChecked([])}
								/>
							)}
							{accessValidator.permission.has('DELETE_MEMBER_ACCOUNT') && (
								<BulkDeleteMember
									ids={z.array(z.coerce.number()).parse(checked)}
									onDeleted={() => setChecked([])}
								/>
							)}
						</Presence>
					)}

					{accessValidator.permission.has('CREATE_MEMBER_ACCOUNT') && <CreateMember />}
				</div>

				<DataTable
					id="members"
					collection={createListCollection({
						items: query.data?.rows ?? [],
						itemToValue: (item) => item.id.toString(),
						itemToString: (item) => item.id.toString(),
					})}
					columns={[
						{
							id: 'name',
							heading: 'Name',
							cell(data) {
								return (
									<div className="flex w-full items-center gap-3">
										<span>{data.name}</span>
										<div className="grow" />
										<MemberProvider value={data}>
											<ViewMember />
										</MemberProvider>
									</div>
								);
							},
						},
						{
							id: 'email',
							heading: 'Email',
							cell(data) {
								return data.email;
							},
							hideable: true,
							orderable: true,
						},
						{
							id: 'status',
							heading: 'Status',
							cell(data) {
								return (
									<Badge.Root
										accent={
											data.status === 'ACTIVE'
												? 'primary'
												: data.status === 'SUSPENDED'
													? 'warning'
													: 'danger'
										}
									>
										<Badge.Label>{data.status}</Badge.Label>
									</Badge.Root>
								);
							},
							hideable: true,
							orderable: true,
							filter: {
								type: 'SELECT',
								multiple: true,
								options: AccountStatusDefinition.options.map((value) => ({
									value,
									label: value,
								})),
								value: state.status ?? [],
								onChange(value) {
									setState({
										status: z.array(AccountStatusDefinition).safeParse(value).data,
									});
								},
								placeholder: 'Select status',
							},
							className: {
								cell: tw`w-32 tabular-nums`,
							},
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
								placeholder: 'Select created date & time',
							},
							className: {
								cell: tw`w-56 tabular-nums`,
							},
						},
						{
							id: 'updatedAt',
							heading: 'Updated date & time',
							cell(data) {
								return format(data.updatedAt, 'dd MMM yyyy hh:mm a');
							},
							sortable: true,
							hideable: true,
							orderable: true,
							filter: {
								type: 'DATE_RANGE',
								value: {
									from: state.updatedAt__from,
									to: state.updatedAt__to,
								},
								onChange(value) {
									setState({
										updatedAt__from: value?.from,
										updatedAt__to: value?.to,
									});
								},
								placeholder: 'Select updated date & time',
							},
							className: {
								cell: tw`w-56 tabular-nums`,
							},
						},
						{
							id: 'actions',
							heading: <SettingsIcon className="size-5" />,
							enabled: accessValidator.permission.hasOneOf([
								'UPDATE_MEMBER_ACCOUNT',
								'DELETE_MEMBER_ACCOUNT',
								'SUSPEND_MEMBER_ACCOUNT',
								'UNSUSPEND_MEMBER_ACCOUNT',
							]),
							cell(data) {
								return (
									<Menu.Root positioning={{placement: 'bottom-end'}}>
										<Menu.Trigger>
											<SettingsIcon className="size-5" />
										</Menu.Trigger>
										<Portal>
											<Menu.Positioner>
												<Menu.Content>
													<MemberProvider value={data}>
														{accessValidator.permission.has('UPDATE_MEMBER_ACCOUNT') && (
															<EditMember />
														)}
														{accessValidator.permission.has('SUSPEND_MEMBER_ACCOUNT') && (
															<SuspendMember />
														)}
														{accessValidator.permission.has('UNSUSPEND_MEMBER_ACCOUNT') && (
															<UnsuspendMember />
														)}
														{accessValidator.permission.has('DELETE_MEMBER_ACCOUNT') && (
															<>
																<Menu.Separator />
																<DeleteMember />
															</>
														)}
													</MemberProvider>
												</Menu.Content>
											</Menu.Positioner>
										</Portal>
									</Menu.Root>
								);
							},
							className: tw`w-0`,
						},
					]}
					total={aggregatesQuery.data?.total}
					page={state.page}
					onPageChange={(page) => setState({page})}
					pageSize={state.pageSize}
					onPageSizeChange={(pageSize) => setState({pageSize})}
					paginationEnabled
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
					loading={query.isLoading}
					onReload={async () => {
						query.refetch();
						aggregatesQuery.refetch();
					}}
					searchEnabled
					search={state.search ?? ''}
					onSearchChange={(search) => {
						setState({search});
					}}
					checkEnabled={accessValidator.permission.hasOneOf([
						'DELETE_MEMBER_ACCOUNT',
						'SUSPEND_MEMBER_ACCOUNT',
						'UNSUSPEND_MEMBER_ACCOUNT',
					])}
					checked={checked}
					onCheckedChange={setChecked}
					cta={<CreateMember />}
				/>
			</div>
		);
	},
	{
		type: 'ADMIN',
	},
);

const INPUT_SORT_COLUMN_MAP: Record<AccountSortColumnInput, string> = {
	CREATED_AT: 'createdAt',
	UPDATED_AT: 'updatedAt',
};

const SORT_COLUMN_INPUT_MAP: Record<string, AccountSortColumnInput> = {
	createdAt: 'CREATED_AT',
	updatedAt: 'UPDATED_AT',
};

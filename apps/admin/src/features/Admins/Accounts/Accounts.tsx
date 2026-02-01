import {createListCollection, Portal} from '@ark-ui/react';
import {AccountStatusDefinition, type AccountSortColumnInput} from '@expense-tracker/defs';
import {format} from 'date-fns';
import {SettingsIcon} from 'lucide-react';
import z from 'zod';
import {DataTable} from '~/components/DataTable';
import {Badge} from '~/components/ui/Badge';
import {Menu} from '~/components/ui/Menu';
import {Tooltip} from '~/components/ui/Tooltip';
import {useAccessValidator} from '~/hooks/useAccessValidator';
import {tw} from '~/utils/tw';
import {useAdminsContext} from '../AdminsContext';
import {AccountProvider} from './AccountsContext';
import {CreateAccount} from './CreateAccount';
import {DeleteAccount} from './DeleteAccount';
import {EditAccount} from './EditAccount';
import {SuspendAccount} from './SuspendAccount';
import {UnsuspendAccount} from './UnsuspendAccount';
import {ViewAccount} from './ViewAccount';

export function Accounts() {
	const context = useAdminsContext();
	const accessValidator = useAccessValidator();

	return (
		<DataTable
			id="admins"
			collection={createListCollection({
				items: context.accountsQuery.data?.rows ?? [],
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
								<AccountProvider value={data}>
									<ViewAccount />
								</AccountProvider>
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
						value: context.accountState.status ?? [],
						onChange(value) {
							context.setAccountState({
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
					id: 'permissions',
					heading: 'Permissions',
					cell(data) {
						const max = 3;
						const visible = data.permissions.slice(0, max);
						const excess = data.permissions.slice(max);

						return (
							<div className="flex gap-1">
								{visible.map((permission) => (
									<Badge.Root key={permission} accent="gray">
										<Badge.Label>{permission.replace(/_/g, ' ')}</Badge.Label>
									</Badge.Root>
								))}

								{excess.length > 0 && (
									<Tooltip.Root>
										<Tooltip.Trigger>
											<Badge.Root accent="gray">
												<Badge.Label>+{excess.length} more</Badge.Label>
											</Badge.Root>
										</Tooltip.Trigger>
										<Portal>
											<Tooltip.Positioner>
												<Tooltip.Content className="p-4">
													<Tooltip.Arrow>
														<Tooltip.ArrowTip />
													</Tooltip.Arrow>
													<ul className="list-inside list-disc space-y-1 marker:text-neutral-700">
														{excess.map((permission) => (
															<li key={permission}>{permission.replace(/_/g, ' ')}</li>
														))}
													</ul>
												</Tooltip.Content>
											</Tooltip.Positioner>
										</Portal>
									</Tooltip.Root>
								)}
							</div>
						);
					},
					hideable: true,
					orderable: true,
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
							from: context.accountState.createdAt__from,
							to: context.accountState.createdAt__to,
						},
						onChange(value) {
							context.setAccountState({
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
							from: context.accountState.updatedAt__from,
							to: context.accountState.updatedAt__to,
						},
						onChange(value) {
							context.setAccountState({
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
						'UPDATE_ADMIN_ACCOUNT',
						'DELETE_ADMIN_ACCOUNT',
						'SUSPEND_ADMIN_ACCOUNT',
						'UNSUSPEND_ADMIN_ACCOUNT',
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
											<AccountProvider value={data}>
												{accessValidator.permission.has('UPDATE_ADMIN_ACCOUNT') && <EditAccount />}
												{accessValidator.permission.has('SUSPEND_ADMIN_ACCOUNT') && (
													<SuspendAccount />
												)}
												{accessValidator.permission.has('UNSUSPEND_ADMIN_ACCOUNT') && (
													<UnsuspendAccount />
												)}
												{accessValidator.permission.has('DELETE_ADMIN_ACCOUNT') && (
													<>
														<Menu.Separator />
														<DeleteAccount />
													</>
												)}
											</AccountProvider>
										</Menu.Content>
									</Menu.Positioner>
								</Portal>
							</Menu.Root>
						);
					},
					className: tw`w-0`,
				},
			]}
			total={context.accountAggregateQuery.data?.total}
			page={context.accountState.page}
			onPageChange={(page) => context.setAccountState({page})}
			pageSize={context.accountState.pageSize}
			onPageSizeChange={(pageSize) => context.setAccountState({pageSize})}
			paginationEnabled
			sortColumn={
				context.accountState.sortBy == null
					? INPUT_SORT_COLUMN_MAP.CREATED_AT
					: INPUT_SORT_COLUMN_MAP[context.accountState.sortBy]
			}
			onSortColumnChange={(value) => {
				context.setAccountState({
					page: 1,
					sortBy: value == null ? 'CREATED_AT' : SORT_COLUMN_INPUT_MAP[value],
				});
			}}
			sortOrder={context.accountState.sortOrder}
			onSortOrderChange={(value) =>
				context.setAccountState({
					page: 1,
					sortOrder: value ?? 'DESC',
				})
			}
			loading={context.accountsQuery.isLoading}
			onReload={async () => {
				context.accountsQuery.refetch();
				context.accountAggregateQuery.refetch();
			}}
			searchEnabled
			search={context.accountState.search ?? ''}
			onSearchChange={(search) => {
				context.setAccountState({search});
			}}
			checkEnabled={accessValidator.permission.hasOneOf([
				'DELETE_ADMIN_ACCOUNT',
				'SUSPEND_ADMIN_ACCOUNT',
				'UNSUSPEND_ADMIN_ACCOUNT',
			])}
			checked={context.selectedAccounts}
			onCheckedChange={context.setSelectedAccounts}
			cta={<CreateAccount />}
		/>
	);
}

const INPUT_SORT_COLUMN_MAP: Record<AccountSortColumnInput, string> = {
	CREATED_AT: 'createdAt',
	UPDATED_AT: 'updatedAt',
};

const SORT_COLUMN_INPUT_MAP: Record<string, AccountSortColumnInput> = {
	createdAt: 'CREATED_AT',
	updatedAt: 'UPDATED_AT',
};

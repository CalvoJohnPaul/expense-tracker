import {createListCollection} from '@ark-ui/react';
import {AdminActivityTypeDefinition} from '@expense-tracker/defs';
import {format} from 'date-fns';
import {isPlainObject} from 'es-toolkit';
import {map} from 'es-toolkit/compat';
import {SquareArrowOutUpRightIcon} from 'lucide-react';
import z from 'zod';
import {DataTable} from '~/components/DataTable';
import {Badge} from '~/components/ui/Badge';
import {queryClient} from '~/config/queryClient';
import type {AccountFilterInput} from '~/definitions';
import {useAccountsQuery} from '~/hooks/useAccountsQuery';
import {tw} from '~/utils/tw';
import {useAdminsContext} from '../AdminsContext';

export function Activities() {
	const context = useAdminsContext();

	return (
		<DataTable
			id="activities"
			collection={createListCollection({
				items: context.activitiesQuery.data?.rows ?? [],
				itemToValue: (item) => item.id.toString(),
				itemToString: (item) => item.id.toString(),
			})}
			columns={[
				{
					id: 'account',
					heading: 'Account',
					cell(data) {
						return (
							<div className="flex w-full items-center gap-3">
								<span>{data.account.name}</span>
								<div className="grow" />
								<button
									type="button"
									className="icon:size-4 text-neutral-500 hover:text-emerald-400"
									onClick={() => {
										context.setTab('accounts');
										context.setActivityState(null);
										context.setAccountState({id: [data.account.id]});
									}}
								>
									<SquareArrowOutUpRightIcon />
								</button>
							</div>
						);
					},
					filter: {
						type: 'ASYNC_COMBOBOX',
						multiple: true,
						options: async (inputValue: string, value: string[]) => {
							const filter: AccountFilterInput = inputValue.length
								? {type: {eq: 'ADMIN'}, name: {contains: inputValue}}
								: value.length
									? {type: {eq: 'ADMIN'}, id: {in: value.map((v) => parseInt(v))}}
									: {type: {eq: 'ADMIN'}};

							const data = await queryClient.fetchQuery({
								queryKey: useAccountsQuery.getQueryKey({filter}),
								queryFn: useAccountsQuery.getQueryFn({
									page: 1,
									pageSize: 25,
									filter,
								}),
							});

							return data.rows.map((o) => ({
								value: o.id.toString(),
								label: o.email,
							}));
						},
						value: context.activityState.account.map((v) => v.toString()),
						onChange: (value) => {
							context.setActivityState({
								account: value.map((v) => parseInt(v)),
							});
						},
						placeholder: 'Search account',
					},
				},
				{
					id: 'type',
					heading: 'Type',
					cell(data) {
						return (
							<Badge.Root accent="gray">
								<Badge.Label>{data.type.replace(/_/g, ' ')}</Badge.Label>
							</Badge.Root>
						);
					},
					filter: {
						type: 'SELECT',
						multiple: true,
						options: AdminActivityTypeDefinition.options.map((value) => ({
							value,
							label: value.replace(/_/g, ' '),
						})),
						placeholder: 'Select type',
						value: context.activityState.type ?? [],
						onChange(value) {
							context.setActivityState({
								type: z.array(AdminActivityTypeDefinition).safeParse(value).data ?? [],
							});
						},
					},
					hideable: true,
					orderable: true,
					className: {
						cell: tw`w-72 tabular-nums`,
					},
				},
				{
					id: 'details',
					heading: 'Details',
					cell(data) {
						return (
							<div className="flex gap-3">
								{isPlainObject(data.details)
									? map(data.details, (v, k) => {
											if (v == null) return null;
											return (
												<div key={k} className="flex font-mono text-sm">
													<span className="text-neutral-400">{k}</span>
													<span className="text-neutral-600">:</span>
													<span className="ml-1 font-medium text-neutral-200">{v}</span>
												</div>
											);
										})
									: null}
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
					filter: {
						type: 'DATE_RANGE',
						placeholder: 'Select created date & time',
					},
					hideable: true,
					orderable: true,
					className: {
						cell: tw`w-56 tabular-nums`,
					},
				},
			]}
			total={context.activityAggregateQuery.data?.total}
			page={context.activityState.page}
			onPageChange={(page) => context.setActivityState({page})}
			pageSize={context.activityState.pageSize}
			onPageSizeChange={(pageSize) => context.setActivityState({pageSize})}
			paginationEnabled
			loading={context.activitiesQuery.isLoading}
			onReload={async () => {
				context.activitiesQuery.refetch();
				context.activityAggregateQuery.refetch();
			}}
		/>
	);
}

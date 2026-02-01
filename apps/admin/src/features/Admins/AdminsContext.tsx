import {createContext} from '@ark-ui/react';
import {
	AccountSortColumnInputDefinition,
	AccountStatusDefinition,
	AdminActivityTypeDefinition,
	SortOrderDefinition,
} from '@expense-tracker/defs';
import {
	parseAsInteger,
	parseAsIsoDate,
	parseAsNativeArrayOf,
	parseAsString,
	parseAsStringLiteral,
	useQueryState,
	useQueryStates,
} from 'nuqs';
import {useState} from 'react';
import * as z from 'zod';
import type {AccountFilterInput, AdminActivityFilterInput} from '~/definitions';
import {useAccountAggregateQuery} from '~/hooks/useAccountAggregateQuery';
import {useAccountsQuery} from '~/hooks/useAccountsQuery';
import {useAdminActivitiesQuery} from '~/hooks/useAdminActivitiesQuery';
import {useAdminActivityAggregateQuery} from '~/hooks/useAdminActivityAggregateQuery';

export type Tab = z.infer<typeof TabDefinition>;
export const TabDefinition = z.enum(['accounts', 'activities']);

export function useAdmins() {
	const [tab, setTab] = useQueryState(
		'tab',
		parseAsStringLiteral(TabDefinition.options).withDefault('accounts'),
	);

	/*
	 *---------------------------------------
	 *	ACCOUNT
	 *---------------------------------------
	 */

	const [accountState, setAccountState] = useQueryStates({
		page: parseAsInteger.withDefault(1),
		pageSize: parseAsInteger.withDefault(10),
		search: parseAsString,
		id: parseAsNativeArrayOf(parseAsInteger),
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

	const accountFilter: AccountFilterInput = {
		type: {
			eq: 'ADMIN',
		},
		...(accountState.id.length && {
			id: {
				in: accountState.id,
			},
		}),
		...(accountState.search && {
			name: {
				contains: accountState.search,
			},
		}),
		...(accountState.search && {
			email: {
				contains: accountState.search,
			},
		}),
		...(accountState.status.length && {
			status: {
				in: accountState.status,
			},
		}),
		...((accountState.createdAt__from || accountState.createdAt__to) && {
			createdAt: {
				gte: accountState.createdAt__from,
				lte: accountState.createdAt__to,
			},
		}),
		...((accountState.updatedAt__from || accountState.updatedAt__to) && {
			updatedAt: {
				gte: accountState.updatedAt__from,
				lte: accountState.updatedAt__to,
			},
		}),
	};

	const accountsQuery = useAccountsQuery(
		{
			page: accountState.page,
			pageSize: accountState.pageSize,
			filter: accountFilter,
			...(accountState.sortBy && {
				sort: {
					column: accountState.sortBy,
					order: accountState.sortOrder,
				},
			}),
		},
		{
			enabled: tab === 'accounts',
		},
	);

	const accountAggregateQuery = useAccountAggregateQuery(accountFilter, {
		enabled: tab === 'accounts',
	});

	const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

	/*
	 *---------------------------------------
	 *	ACTIVITY
	 *---------------------------------------
	 */

	const [activityState, setActivityState] = useQueryStates({
		page: parseAsInteger.withDefault(1),
		pageSize: parseAsInteger.withDefault(10),
		type: parseAsNativeArrayOf(parseAsStringLiteral(AdminActivityTypeDefinition.options)),
		account: parseAsNativeArrayOf(parseAsInteger),
	});

	const activityFilter: AdminActivityFilterInput = {
		...(activityState.type.length && {
			type: {
				in: activityState.type,
			},
		}),
		...(activityState.account.length && {
			account: {
				in: activityState.account,
			},
		}),
	};

	const activitiesQuery = useAdminActivitiesQuery(
		{
			page: activityState.page,
			pageSize: activityState.pageSize,
			filter: activityFilter,
		},
		{
			enabled: tab === 'activities',
		},
	);

	const activityAggregateQuery = useAdminActivityAggregateQuery(activityFilter, {
		enabled: tab === 'activities',
	});

	return {
		tab,
		setTab,
		accountState,
		activityState,
		setAccountState,
		setActivityState,
		accountFilter,
		activityFilter,
		accountsQuery,
		activitiesQuery,
		accountAggregateQuery,
		activityAggregateQuery,
		selectedAccounts,
		setSelectedAccounts,
	};
}

export const [AdminsProvider, useAdminsContext] = createContext<ReturnType<typeof useAdmins>>();

import {
	AdminActivityDefinition,
	HttpResponseDefinition,
	PaginatedDefinition,
	type AdminActivity,
	type Paginated,
} from '@expense-tracker/defs';
import {useQuery, type QueryKey, type UseQueryOptions} from '@tanstack/react-query';
import {isNil} from 'es-toolkit';
import {isEmpty} from 'es-toolkit/compat';
import {API_URL} from '~/constants';
import type {AdminActivityInput} from '../definitions';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

export function useAdminActivitiesQuery(
	input?: AdminActivityInput,
	options?: Pick<
		UseQueryOptions<Paginated<AdminActivity>>,
		| 'enabled'
		| 'gcTime'
		| 'staleTime'
		| 'initialData'
		| 'initialDataUpdatedAt'
		| 'refetchInterval'
		| 'refetchOnMount'
		| 'refetchOnReconnect'
		| 'refetchOnWindowFocus'
		| 'retry'
		| 'retryDelay'
		| 'retryOnMount'
	>,
) {
	const query = useCurrentAccountQuery();

	return useQuery({
		...options,
		enabled: query.data == null ? false : (options?.enabled ?? true),
		queryKey: getQueryKey(input),
		queryFn: async ({signal}) => {
			const params = new URLSearchParams();

			params.set('page', input?.page?.toString() ?? '1');
			params.set('pageSize', input?.pageSize?.toString() ?? '10');

			if (input?.filter?.type?.eq) params.set('type__eq', input.filter.type.eq);
			if (input?.filter?.type?.neq) params.set('type__neq', input.filter.type.neq);
			if (input?.filter?.type?.in)
				input.filter.type.in.forEach((v) => {
					params.append('type__in', v);
				});
			if (input?.filter?.type?.nin)
				input.filter.type.nin.forEach((v) => {
					params.append('type__nin', v);
				});

			if (input?.filter?.account?.eq) params.set('account__eq', input.filter.account.eq.toString());
			if (input?.filter?.account?.neq)
				params.set('account__neq', input.filter.account.neq.toString());
			if (input?.filter?.account?.in)
				input.filter.account.in.forEach((v) => {
					params.append('account__in', v.toString());
				});
			if (input?.filter?.account?.nin)
				input.filter.account.nin.forEach((v) => {
					params.append('account__nin', v.toString());
				});

			const res = await fetch(`${API_URL}/admin-activities?${params.toString()}`, {
				signal,
				credentials: 'include',
			});

			const obj = HttpResponseDefinition(PaginatedDefinition(AdminActivityDefinition)).parse(
				await res.json(),
			);

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

const getQueryKey = (input?: AdminActivityInput): QueryKey =>
	['AdminActivities', input].filter((v) => !isNil(v) && !isEmpty(v));

useAdminActivitiesQuery.getQueryKey = getQueryKey;

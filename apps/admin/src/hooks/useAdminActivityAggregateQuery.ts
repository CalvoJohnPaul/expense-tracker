import {
	AdminActivityAggregateDefinition,
	HttpResponseDefinition,
	type AdminActivityAggregate,
} from '@expense-tracker/defs';
import {useQuery, type QueryKey, type UseQueryOptions} from '@tanstack/react-query';
import {isNil} from 'es-toolkit';
import {isEmpty} from 'es-toolkit/compat';
import {API_URL} from '~/constants';
import type {AdminActivityFilterInput} from '../definitions';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

export function useAdminActivityAggregateQuery(
	input?: AdminActivityFilterInput,
	options?: Pick<
		UseQueryOptions<AdminActivityAggregate>,
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

			if (input?.type?.eq) params.set('type__eq', input.type.eq);
			if (input?.type?.neq) params.set('type__neq', input.type.neq);
			if (input?.type?.in)
				input.type.in.forEach((v) => {
					params.append('type__in', v);
				});
			if (input?.type?.nin)
				input.type.nin.forEach((v) => {
					params.append('type__nin', v);
				});

			if (input?.account?.eq) params.set('account__eq', input.account.eq.toString());
			if (input?.account?.neq) params.set('account__neq', input.account.neq.toString());
			if (input?.account?.in)
				input.account.in.forEach((v) => {
					params.append('account__in', v.toString());
				});
			if (input?.account?.nin)
				input.account.nin.forEach((v) => {
					params.append('account__nin', v.toString());
				});

			if (input?.createdAt?.gt) params.set('createdAt__gt', input.createdAt.gt.toString());
			if (input?.createdAt?.gte) params.set('createdAt__gte', input.createdAt.gte.toString());
			if (input?.createdAt?.lt) params.set('createdAt__lt', input.createdAt.lt.toString());
			if (input?.createdAt?.lte) params.set('createdAt__lte', input.createdAt.lte.toString());

			if (input?.updatedAt?.gt) params.set('updatedAt__gt', input.updatedAt.gt.toString());
			if (input?.updatedAt?.gte) params.set('updatedAt__gte', input.updatedAt.gte.toString());
			if (input?.updatedAt?.lt) params.set('updatedAt__lt', input.updatedAt.lt.toString());
			if (input?.updatedAt?.lte) params.set('updatedAt__lte', input.updatedAt.lte.toString());

			const res = await fetch(`${API_URL}/admin-activities/aggregate?${params.toString()}`, {
				signal,
				credentials: 'include',
			});

			const obj = HttpResponseDefinition(AdminActivityAggregateDefinition).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

const getQueryKey = (input?: AdminActivityFilterInput): QueryKey =>
	['AdminActivityAggregate', input].filter((v) => !isNil(v) && !isEmpty(v));

useAdminActivityAggregateQuery.getQueryKey = getQueryKey;

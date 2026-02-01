import {
	AccountDefinition,
	HttpResponseDefinition,
	PaginatedDefinition,
	type Account,
	type Paginated,
} from '@expense-tracker/defs';
import {
	useQuery,
	type QueryFunctionContext,
	type QueryKey,
	type UseQueryOptions,
} from '@tanstack/react-query';
import {isNil} from 'es-toolkit';
import {isEmpty} from 'es-toolkit/compat';
import {API_URL} from '~/constants';
import type {AccountInput} from '../definitions';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

const getQueryKey = (input?: AccountInput): QueryKey =>
	['Accounts', input].filter((v) => !isNil(v) && !isEmpty(v));

const getQueryFn = (input?: AccountInput) => async (ctx?: QueryFunctionContext) => {
	const params = new URLSearchParams();

	params.set('page', input?.page?.toString() ?? '1');
	params.set('pageSize', input?.pageSize?.toString() ?? '10');

	if (input?.filter?.id?.eq) params.set('id__eq', input.filter.id.eq.toString());
	if (input?.filter?.id?.neq) params.set('id__neq', input.filter.id.neq.toString());
	if (input?.filter?.id?.in)
		input.filter.id.in.forEach((v) => {
			params.append('id__in', v.toString());
		});
	if (input?.filter?.id?.nin)
		input.filter.id.nin.forEach((v) => {
			params.append('id__nin', v.toString());
		});

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

	if (input?.filter?.status?.eq) params.set('status__eq', input.filter.status.eq);
	if (input?.filter?.status?.neq) params.set('status__neq', input.filter.status.neq);
	if (input?.filter?.status?.in)
		input.filter.status.in.forEach((v) => {
			params.append('status__in', v);
		});
	if (input?.filter?.status?.nin)
		input.filter.status.nin.forEach((v) => {
			params.append('status__nin', v);
		});

	if (input?.filter?.name?.eq) params.set('name__eq', input.filter.name.eq);
	if (input?.filter?.name?.neq) params.set('name__neq', input.filter.name.neq);
	if (input?.filter?.name?.contains) params.set('name__contains', input.filter.name.contains);
	if (input?.filter?.name?.in)
		input.filter.name.in.forEach((v) => {
			params.append('name__in', v);
		});
	if (input?.filter?.name?.nin)
		input.filter.name.nin.forEach((v) => {
			params.append('name__nin', v);
		});

	if (input?.filter?.email?.eq) params.set('email__eq', input.filter.email.eq);
	if (input?.filter?.email?.neq) params.set('email__neq', input.filter.email.neq);
	if (input?.filter?.email?.contains) params.set('email__contains', input.filter.email.contains);
	if (input?.filter?.email?.in)
		input.filter.email.in.forEach((v) => {
			params.append('email__in', v);
		});
	if (input?.filter?.email?.nin)
		input.filter.email.nin.forEach((v) => {
			params.append('email__nin', v);
		});

	if (input?.filter?.createdAt?.gt)
		params.set('createdAt__gt', input.filter.createdAt.gt.toString());
	if (input?.filter?.createdAt?.gte)
		params.set('createdAt__gte', input.filter.createdAt.gte.toString());
	if (input?.filter?.createdAt?.lt)
		params.set('createdAt__lt', input.filter.createdAt.lt.toString());
	if (input?.filter?.createdAt?.lte)
		params.set('createdAt__lte', input.filter.createdAt.lte.toString());

	if (input?.filter?.updatedAt?.gt)
		params.set('updatedAt__gt', input.filter.updatedAt.gt.toString());
	if (input?.filter?.updatedAt?.gte)
		params.set('updatedAt__gte', input.filter.updatedAt.gte.toString());
	if (input?.filter?.updatedAt?.lt)
		params.set('updatedAt__lt', input.filter.updatedAt.lt.toString());
	if (input?.filter?.updatedAt?.lte)
		params.set('updatedAt__lte', input.filter.updatedAt.lte.toString());

	if (input?.sort?.column) params.set('sortBy', input.sort.column);
	if (input?.sort?.order) params.set('sortOrder', input.sort.order);

	const res = await fetch(`${API_URL}/accounts?${params.toString()}`, {
		signal: ctx?.signal,
		credentials: 'include',
	});

	const obj = HttpResponseDefinition(PaginatedDefinition(AccountDefinition)).parse(
		await res.json(),
	);

	if (obj.ok) return obj.data;

	const err = new Error();
	err.name = obj.error.name;
	err.message = obj.error.message;
	throw err;
};

export function useAccountsQuery(
	input?: AccountInput,
	options?: Pick<
		UseQueryOptions<Paginated<Account>>,
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
		queryFn: getQueryFn(input),
	});
}

useAccountsQuery.getQueryFn = getQueryFn;
useAccountsQuery.getQueryKey = getQueryKey;

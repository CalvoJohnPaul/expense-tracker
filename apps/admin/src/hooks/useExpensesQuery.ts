import {
	ExpenseDefinition,
	HttpResponseDefinition,
	PaginatedDefinition,
	type Expense,
	type Paginated,
} from '@expense-tracker/defs';
import {useQuery, type QueryKey, type UseQueryOptions} from '@tanstack/react-query';
import {isNil} from 'es-toolkit';
import {isEmpty} from 'es-toolkit/compat';
import {API_URL} from '~/constants';
import type {ExpenseInput} from '../definitions';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

export function useExpensesQuery(
	input?: ExpenseInput,
	options?: Pick<
		UseQueryOptions<Paginated<Expense>>,
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

			if (input?.filter?.amount?.gt) params.set('amount__gt', input.filter.amount.gt.toString());
			if (input?.filter?.amount?.gte) params.set('amount__gte', input.filter.amount.gte.toString());
			if (input?.filter?.amount?.lt) params.set('amount__lt', input.filter.amount.lt.toString());
			if (input?.filter?.amount?.lte) params.set('amount__lte', input.filter.amount.lte.toString());

			if (input?.filter?.category?.eq) params.set('category__eq', input.filter.category.eq);
			if (input?.filter?.category?.neq) params.set('category__neq', input.filter.category.neq);
			if (input?.filter?.category?.in)
				input.filter.category.in.forEach((v) => {
					params.append('category__in', v);
				});
			if (input?.filter?.category?.nin)
				input.filter.category.nin.forEach((v) => {
					params.append('category__nin', v);
				});

			if (input?.filter?.location?.eq) params.set('location__eq', input.filter.location.eq);
			if (input?.filter?.location?.neq) params.set('location__neq', input.filter.location.neq);
			if (input?.filter?.location?.contains)
				params.set('location__contains', input.filter.location.contains);
			if (input?.filter?.location?.in)
				input.filter.location.in.forEach((v) => {
					params.append('location__in', v);
				});
			if (input?.filter?.location?.nin)
				input.filter.location.nin.forEach((v) => {
					params.append('location__nin', v);
				});

			if (input?.filter?.transactionDate?.gt)
				params.set('transactionDate__gt', input.filter.transactionDate.gt.toString());
			if (input?.filter?.transactionDate?.gte)
				params.set('transactionDate__gte', input.filter.transactionDate.gte.toString());
			if (input?.filter?.transactionDate?.lt)
				params.set('transactionDate__lt', input.filter.transactionDate.lt.toString());
			if (input?.filter?.transactionDate?.lte)
				params.set('transactionDate__lte', input.filter.transactionDate.lte.toString());

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

			const res = await fetch(`${API_URL}/expenses?${params.toString()}`, {
				signal,
				credentials: 'include',
			});

			const obj = HttpResponseDefinition(PaginatedDefinition(ExpenseDefinition)).parse(
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

const getQueryKey = (input?: ExpenseInput): QueryKey =>
	['Expenses', input].filter((v) => !isNil(v) && !isEmpty(v));

useExpensesQuery.getQueryKey = getQueryKey;

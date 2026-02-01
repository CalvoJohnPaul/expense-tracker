import {
	ExpenseAggregateDefinition,
	HttpResponseDefinition,
	type ExpenseAggregate,
} from '@expense-tracker/defs';
import {useQuery, type QueryKey, type UseQueryOptions} from '@tanstack/react-query';
import {isNil} from 'es-toolkit';
import {isEmpty} from 'es-toolkit/compat';
import {API_URL} from '~/constants';
import type {ExpenseFilterInput} from '../definitions';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

export function useExpenseAggregateQuery(
	input?: ExpenseFilterInput,
	options?: Pick<
		UseQueryOptions<ExpenseAggregate>,
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

			if (input?.amount?.gt) params.set('amount__gt', input.amount.gt.toString());
			if (input?.amount?.gte) params.set('amount__gte', input.amount.gte.toString());
			if (input?.amount?.lt) params.set('amount__lt', input.amount.lt.toString());
			if (input?.amount?.lte) params.set('amount__lte', input.amount.lte.toString());

			if (input?.category?.eq) params.set('category__eq', input.category.eq);
			if (input?.category?.neq) params.set('category__neq', input.category.neq);
			if (input?.category?.in)
				input.category.in.forEach((v) => {
					params.append('category__in', v);
				});
			if (input?.category?.nin)
				input.category.nin.forEach((v) => {
					params.append('category__nin', v);
				});

			if (input?.location?.eq) params.set('location__eq', input.location.eq);
			if (input?.location?.neq) params.set('location__neq', input.location.neq);
			if (input?.location?.contains) params.set('location__contains', input.location.contains);
			if (input?.location?.in)
				input.location.in.forEach((v) => {
					params.append('location__in', v);
				});
			if (input?.location?.nin)
				input.location.nin.forEach((v) => {
					params.append('location__nin', v);
				});

			if (input?.transactionDate?.gt)
				params.set('transactionDate__gt', input.transactionDate.gt.toString());
			if (input?.transactionDate?.gte)
				params.set('transactionDate__gte', input.transactionDate.gte.toString());
			if (input?.transactionDate?.lt)
				params.set('transactionDate__lt', input.transactionDate.lt.toString());
			if (input?.transactionDate?.lte)
				params.set('transactionDate__lte', input.transactionDate.lte.toString());

			if (input?.createdAt?.gt) params.set('createdAt__gt', input.createdAt.gt.toString());
			if (input?.createdAt?.gte) params.set('createdAt__gte', input.createdAt.gte.toString());
			if (input?.createdAt?.lt) params.set('createdAt__lt', input.createdAt.lt.toString());
			if (input?.createdAt?.lte) params.set('createdAt__lte', input.createdAt.lte.toString());

			if (input?.updatedAt?.gt) params.set('updatedAt__gt', input.updatedAt.gt.toString());
			if (input?.updatedAt?.gte) params.set('updatedAt__gte', input.updatedAt.gte.toString());
			if (input?.updatedAt?.lt) params.set('updatedAt__lt', input.updatedAt.lt.toString());
			if (input?.updatedAt?.lte) params.set('updatedAt__lte', input.updatedAt.lte.toString());

			const res = await fetch(`${API_URL}/expenses/aggregate?${params.toString()}`, {
				signal,
				credentials: 'include',
			});

			const obj = HttpResponseDefinition(ExpenseAggregateDefinition).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

const getQueryKey = (input?: ExpenseFilterInput): QueryKey =>
	['ExpenseAggregate', input].filter((v) => !isNil(v) && !isEmpty(v));

useExpenseAggregateQuery.getQueryKey = getQueryKey;

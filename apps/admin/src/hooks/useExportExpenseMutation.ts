import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import type {ExpenseFilterInput} from '../definitions';
import {useCsrfQuery} from './useCsrfQuery';

export function useExportExpenseMutation(
	options?: Pick<
		UseMutationOptions<Blob, Error, ExpenseFilterInput>,
		| 'gcTime'
		| 'onMutate'
		| 'onSettled'
		| 'onSuccess'
		| 'onError'
		| 'retry'
		| 'retryDelay'
		| 'throwOnError'
	>,
) {
	return useMutation({
		...options,
		mutationKey: ['ExportExpense'],
		mutationFn: async (filter) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const params = new URLSearchParams();

			if (filter?.amount?.gt) params.set('amount__gt', filter.amount.gt.toString());
			if (filter?.amount?.gte) params.set('amount__gte', filter.amount.gte.toString());
			if (filter?.amount?.lt) params.set('amount__lt', filter.amount.lt.toString());
			if (filter?.amount?.lte) params.set('amount__lte', filter.amount.lte.toString());

			if (filter?.category?.eq) params.set('category__eq', filter.category.eq);
			if (filter?.category?.neq) params.set('category__neq', filter.category.neq);
			if (filter?.category?.in)
				filter.category.in.forEach((v) => {
					params.append('category__in', v);
				});
			if (filter?.category?.nin)
				filter.category.nin.forEach((v) => {
					params.append('category__nin', v);
				});

			if (filter?.location?.eq) params.set('location__eq', filter.location.eq);
			if (filter?.location?.neq) params.set('location__neq', filter.location.neq);
			if (filter?.location?.contains) params.set('location__contains', filter.location.contains);
			if (filter?.location?.in)
				filter.location.in.forEach((v) => {
					params.append('location__in', v);
				});
			if (filter?.location?.nin)
				filter.location.nin.forEach((v) => {
					params.append('location__nin', v);
				});

			if (filter?.transactionDate?.gt)
				params.set('transactionDate__gt', filter.transactionDate.gt.toString());
			if (filter?.transactionDate?.gte)
				params.set('transactionDate__gte', filter.transactionDate.gte.toString());
			if (filter?.transactionDate?.lt)
				params.set('transactionDate__lt', filter.transactionDate.lt.toString());
			if (filter?.transactionDate?.lte)
				params.set('transactionDate__lte', filter.transactionDate.lte.toString());

			const res = await fetch(`${API_URL}/expenses/export?${params.toString()}`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRF-Token': csrf.token,
				},
			});

			return await res.blob();
		},
	});
}

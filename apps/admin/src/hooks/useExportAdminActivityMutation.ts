import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import type {AdminActivityFilterInput} from '../definitions';
import {useCsrfQuery} from './useCsrfQuery';

export function useExportAdminActivityMutation(
	options?: Pick<
		UseMutationOptions<Blob, Error, AdminActivityFilterInput>,
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
		mutationKey: ['ExportAdminActivity'],
		mutationFn: async (filter) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const params = new URLSearchParams();

			if (filter?.type?.eq) params.set('type__eq', filter.type.eq);
			if (filter?.type?.neq) params.set('type__neq', filter.type.neq);
			if (filter?.type?.in)
				filter.type.in.forEach((v) => {
					params.append('type__in', v);
				});
			if (filter?.type?.nin)
				filter.type.nin.forEach((v) => {
					params.append('type__nin', v);
				});

			if (filter?.account?.eq) params.set('account__eq', filter.account.eq.toString());
			if (filter?.account?.neq) params.set('account__neq', filter.account.neq.toString());
			if (filter?.account?.in)
				filter.account.in.forEach((v) => {
					params.append('account__in', v.toString());
				});
			if (filter?.account?.nin)
				filter.account.nin.forEach((v) => {
					params.append('account__nin', v.toString());
				});

			const res = await fetch(`${API_URL}/admin-activities/export?${params.toString()}`, {
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

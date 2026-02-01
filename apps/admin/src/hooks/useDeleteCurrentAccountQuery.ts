import {VoidHttpResponseDefinition} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useDeleteCurrentAccountMutation(
	options?: Pick<
		UseMutationOptions<void>,
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
		mutationKey: ['DeleteCurrentAccount'],
		mutationFn: async () => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/me`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'X-CSRF-Token': csrf.token,
					'Content-Type': 'application/json',
				},
			});

			const obj = VoidHttpResponseDefinition.parse(await res.json());

			if (!obj.ok) {
				const err = new Error();
				err.name = obj.error.name;
				err.message = obj.error.message;
				throw err;
			}
		},
	});
}

import {VoidHttpResponseDefinition} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useDestroySessionMutation(
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
		mutationKey: ['DestroySession'],
		mutationFn: async () => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/session`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'X-CSRF-Token': csrf.token,
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

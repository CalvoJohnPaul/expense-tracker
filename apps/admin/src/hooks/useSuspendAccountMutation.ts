import {AccountDefinition, HttpResponseDefinition, type Account} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useSuspendAccountMutation(
	options?: Pick<
		UseMutationOptions<Account, Error, number>,
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
		mutationKey: ['SuspendAccount'],
		mutationFn: async (id) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/accounts/${id}/suspend`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'X-CSRF-Token': csrf.token,
				},
			});

			const obj = HttpResponseDefinition(AccountDefinition).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

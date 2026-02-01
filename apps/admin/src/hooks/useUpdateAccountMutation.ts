import {
	AccountDefinition,
	HttpResponseDefinition,
	type Account,
	type UpdateAccountInput,
} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useUpdateAccountMutation(
	options?: Pick<
		UseMutationOptions<Account, Error, UpdateAccountInput>,
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
		mutationKey: ['UpdateAccount'],
		mutationFn: async (input) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/accounts/${input.id}`, {
				method: 'PATCH',
				body: JSON.stringify(input.data),
				credentials: 'include',
				headers: {
					'X-CSRF-Token': csrf.token,
					'Content-Type': 'application/json',
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

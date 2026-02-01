import {
	AccountDefinition,
	HttpResponseDefinition,
	type Account,
	type CreateAccountInput,
} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import type {Simplify} from 'type-fest';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useRegisterAccountMutation(
	options?: Pick<
		UseMutationOptions<Account, Error, Simplify<Omit<CreateAccountInput, 'type' | 'permissions'>>>,
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
		mutationKey: ['RegisterAccount'],
		mutationFn: async (input) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/register-account`, {
				method: 'POST',
				body: JSON.stringify(input),
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

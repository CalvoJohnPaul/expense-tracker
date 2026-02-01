import {
	AccountDefinition,
	HttpResponseDefinition,
	type Account,
	type UpdateAccountDataInput,
} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import type {Simplify} from 'type-fest';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useUpdateCurrentAccountMutation(
	options?: Pick<
		UseMutationOptions<
			Account,
			Error,
			Simplify<Omit<UpdateAccountDataInput, 'password' | 'permissions'>>
		>,
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
		mutationKey: ['UpdateCurrentAccount'],
		mutationFn: async (input) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/me`, {
				method: 'PATCH',
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

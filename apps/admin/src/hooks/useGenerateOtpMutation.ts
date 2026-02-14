import {VoidHttpResponseDefinition} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useGenerateOtpMutation(
	options?: Pick<
		UseMutationOptions<void, Error, string>,
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
		mutationKey: ['GenerateOtp'],
		mutationFn: async (email) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/otps`, {
				method: 'POST',
				body: JSON.stringify({email}),
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
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

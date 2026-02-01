import {
	ExpenseDefinition,
	HttpResponseDefinition,
	type Expense,
	type UpdateExpenseInput,
} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useUpdateExpenseMutation(
	options?: Pick<
		UseMutationOptions<Expense, Error, UpdateExpenseInput>,
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
		mutationKey: ['UpdateExpense'],
		mutationFn: async (input) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/expenses/${input.id}`, {
				method: 'PATCH',
				body: JSON.stringify(input.data),
				credentials: 'include',
				headers: {
					'X-CSRF-Token': csrf.token,
					'Content-Type': 'application/json',
				},
			});

			const obj = HttpResponseDefinition(ExpenseDefinition).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

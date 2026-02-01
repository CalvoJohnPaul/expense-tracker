import {
	ExpenseDefinition,
	HttpResponseDefinition,
	type CreateExpenseInput,
	type Expense,
} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useCreateExpenseMutation(
	options?: Pick<
		UseMutationOptions<Expense, Error, CreateExpenseInput>,
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
		mutationKey: ['CreateExpense'],
		mutationFn: async (input) => {
			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/expenses`, {
				method: 'POST',
				body: JSON.stringify(input),
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

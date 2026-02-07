import {
	HttpResponseDefinition,
	UploadedFileDefinition,
	type UploadedFile,
} from '@expense-tracker/defs';
import {useMutation, type UseMutationOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCsrfQuery} from './useCsrfQuery';

export function useUploadFileMutation(
	options?: Pick<
		UseMutationOptions<UploadedFile, Error, File>,
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
		mutationKey: ['UploadFile'],
		mutationFn: async (input) => {
			const ext = input.name.split('.').pop() ?? 'png';
			const name = `${crypto.randomUUID()}.${ext}`;
			const file = new File([input], name, {type: input.type});
			const form = new FormData();
			form.append('file', file);

			const csrf = await useCsrfQuery.getQueryFn()();
			const res = await fetch(`${API_URL}/uploads`, {
				method: 'PUT',
				body: form,
				credentials: 'include',
				headers: {
					'X-CSRF-Token': csrf.token,
				},
			});

			const obj = HttpResponseDefinition(UploadedFileDefinition).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

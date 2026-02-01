import {AccountDefinition, HttpResponseDefinition, type Account} from '@expense-tracker/defs';
import {useQuery, type QueryKey, type UseQueryOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';

export function useCurrentAccountQuery(
	options?: Pick<
		UseQueryOptions<Account | null>,
		| 'enabled'
		| 'gcTime'
		| 'staleTime'
		| 'initialData'
		| 'initialDataUpdatedAt'
		| 'refetchInterval'
		| 'refetchOnMount'
		| 'refetchOnReconnect'
		| 'refetchOnWindowFocus'
		| 'retry'
		| 'retryDelay'
		| 'retryOnMount'
	>,
) {
	return useQuery({
		...options,
		queryKey: getQueryKey(),
		queryFn: async ({signal}) => {
			const res = await fetch(`${API_URL}/me`, {
				signal,
				credentials: 'include',
			});

			const obj = HttpResponseDefinition(AccountDefinition.nullable()).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

const getQueryKey = (): QueryKey => ['Me'];

useCurrentAccountQuery.getQueryKey = getQueryKey;

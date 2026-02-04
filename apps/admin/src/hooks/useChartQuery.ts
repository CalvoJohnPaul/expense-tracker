import {ChartDataDefinition, HttpResponseDefinition, type ChartData} from '@expense-tracker/defs';
import {useQuery, type QueryKey, type UseQueryOptions} from '@tanstack/react-query';
import {API_URL} from '~/constants';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

export function useChartQuery(
	options?: Pick<
		UseQueryOptions<ChartData>,
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
	const query = useCurrentAccountQuery();

	return useQuery({
		...options,
		enabled: query.data == null ? false : (options?.enabled ?? true),
		queryKey: getQueryKey(),
		queryFn: async ({signal}) => {
			const res = await fetch(`${API_URL}/chart`, {
				signal,
				credentials: 'include',
			});

			const obj = HttpResponseDefinition(ChartDataDefinition).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

const getQueryKey = (): QueryKey => ['Chart'];

useChartQuery.getQueryKey = getQueryKey;

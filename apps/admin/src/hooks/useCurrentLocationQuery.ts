import {type QueryKey, useQuery, type UseQueryOptions} from '@tanstack/react-query';
import * as z from 'zod';

export function useCurrentLocationQuery(
	options?: Pick<
		UseQueryOptions<string>,
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
			try {
				const res = await fetch('https://ipapi.co/json', {
					signal,
					credentials: 'omit',
				});

				const data = await res.json();

				return z
					.object({
						city: z.string().optional().nullable(),
						country_name: z.string().optional().nullable(),
					})
					.transform((v) => [v.city, v.country_name].filter(Boolean).join(', '))
					.parse(data);
			} catch {
				return '';
			}
		},
	});
}

const getQueryKey = (): QueryKey => ['CurrentLocation'];

useCurrentLocationQuery.getQueryKey = getQueryKey;

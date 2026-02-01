import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 4,
			staleTime: 1000 * 60 * 60 * 1,
			retry: 3,
			refetchOnMount: true,
			refetchOnReconnect: 'always',
			refetchOnWindowFocus: true,
		},
		mutations: {
			gcTime: 0,
		},
	},
});

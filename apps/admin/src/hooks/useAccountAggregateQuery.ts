import type {AccountAggregate} from '@expense-tracker/defs';
import {AccountAggregateDefinition, HttpResponseDefinition} from '@expense-tracker/defs';
import {useQuery, type QueryKey, type UseQueryOptions} from '@tanstack/react-query';
import {isNil} from 'es-toolkit';
import {isEmpty} from 'es-toolkit/compat';
import {API_URL} from '~/constants';
import type {AccountFilterInput} from '../definitions';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

export function useAccountAggregateQuery(
	input?: AccountFilterInput,
	options?: Pick<
		UseQueryOptions<AccountAggregate>,
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
		queryKey: getQueryKey(input),
		queryFn: async ({signal}) => {
			const params = new URLSearchParams();

			if (input?.id?.eq) params.set('id__eq', input.id.eq.toString());
			if (input?.id?.neq) params.set('id__neq', input.id.neq.toString());
			if (input?.id?.in)
				input.id.in.forEach((v) => {
					params.append('id__in', v.toString());
				});
			if (input?.id?.nin)
				input.id.nin.forEach((v) => {
					params.append('id__nin', v.toString());
				});

			if (input?.type?.eq) params.set('type__eq', input.type.eq);
			if (input?.type?.neq) params.set('type__neq', input.type.neq);
			if (input?.type?.in)
				input.type.in.forEach((v) => {
					params.append('type__in', v);
				});
			if (input?.type?.nin)
				input.type.nin.forEach((v) => {
					params.append('type__nin', v);
				});

			if (input?.name?.eq) params.set('name__eq', input.name.eq);
			if (input?.name?.neq) params.set('name__neq', input.name.neq);
			if (input?.name?.contains) params.set('name__contains', input.name.contains);
			if (input?.name?.in)
				input.name.in.forEach((v) => {
					params.append('name__in', v);
				});
			if (input?.name?.nin)
				input.name.nin.forEach((v) => {
					params.append('name__nin', v);
				});

			if (input?.email?.eq) params.set('email__eq', input.email.eq);
			if (input?.email?.neq) params.set('email__neq', input.email.neq);
			if (input?.email?.contains) params.set('email__contains', input.email.contains);
			if (input?.email?.in)
				input.email.in.forEach((v) => {
					params.append('email__in', v);
				});
			if (input?.email?.nin)
				input.email.nin.forEach((v) => {
					params.append('email__nin', v);
				});

			if (input?.status?.eq) params.set('status__eq', input.status.eq);
			if (input?.status?.neq) params.set('status__neq', input.status.neq);
			if (input?.status?.in)
				input.status.in.forEach((v) => {
					params.append('status__in', v);
				});
			if (input?.status?.nin)
				input.status.nin.forEach((v) => {
					params.append('status__nin', v);
				});

			if (input?.name?.eq) params.set('name__eq', input.name.eq);
			if (input?.name?.neq) params.set('name__neq', input.name.neq);
			if (input?.name?.contains) params.set('name__contains', input.name.contains);
			if (input?.name?.in)
				input.name.in.forEach((v) => {
					params.append('name__in', v);
				});
			if (input?.name?.nin)
				input.name.nin.forEach((v) => {
					params.append('name__nin', v);
				});

			if (input?.createdAt?.gt) params.set('createdAt__gt', input.createdAt.gt.toString());
			if (input?.createdAt?.gte) params.set('createdAt__gte', input.createdAt.gte.toString());
			if (input?.createdAt?.lt) params.set('createdAt__lt', input.createdAt.lt.toString());
			if (input?.createdAt?.lte) params.set('createdAt__lte', input.createdAt.lte.toString());

			if (input?.updatedAt?.gt) params.set('updatedAt__gt', input.updatedAt.gt.toString());
			if (input?.updatedAt?.gte) params.set('updatedAt__gte', input.updatedAt.gte.toString());
			if (input?.updatedAt?.lt) params.set('updatedAt__lt', input.updatedAt.lt.toString());
			if (input?.updatedAt?.lte) params.set('updatedAt__lte', input.updatedAt.lte.toString());

			const res = await fetch(`${API_URL}/accounts/aggregate?${params.toString()}`, {
				signal,
				credentials: 'include',
			});

			const obj = HttpResponseDefinition(AccountAggregateDefinition).parse(await res.json());

			if (obj.ok) return obj.data;

			const err = new Error();
			err.name = obj.error.name;
			err.message = obj.error.message;
			throw err;
		},
	});
}

const getQueryKey = (input?: AccountFilterInput): QueryKey =>
	['AccountAggregate', input].filter((v) => !isNil(v) && !isEmpty(v));

useAccountAggregateQuery.getQueryKey = getQueryKey;

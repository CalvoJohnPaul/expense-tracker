import type {AccountType, Permission} from '@expense-tracker/defs';
import {delay} from 'es-toolkit';
import {LockIcon} from 'lucide-react';
import type {ComponentType, PropsWithChildren, ReactNode} from 'react';
import {useNavigate} from 'react-router';
import {queryClient} from '~/config/queryClient';
import {useCurrentAccountQuery} from '~/hooks/useCurrentAccountQuery';
import {useDestroySessionMutation} from '~/hooks/useDestroySessionMutation';
import {callIfFn} from '~/utils/callIfFn';
import {Button} from './ui/Button';
import {FeaturedIcon} from './ui/FeaturedIcon';

export interface ProtectedProps {
	type?: AccountType | [AccountType, ...AccountType[]];
	permission?: Permission | [Permission, ...Permission[]];
	loader?: ReactNode;
	fallback?:
		| ReactNode
		| ((reason: 'AUTHENTICATION_REQUIRED' | 'NOT_ENOUGH_PERMISSION') => ReactNode);
}

export function Protected(props: PropsWithChildren<ProtectedProps>): ReactNode {
	const query = useCurrentAccountQuery();
	const account = query.data ?? null;
	const types = props.type == null ? [] : Array.isArray(props.type) ? props.type : [props.type];
	const permissions =
		props.permission == null
			? []
			: Array.isArray(props.permission)
				? props.permission
				: [props.permission];

	if (query.isLoading) {
		return props.loader ?? null;
	}

	if (account == null) {
		return callIfFn(props.fallback, 'AUTHENTICATION_REQUIRED');
	}

	if (types.length > 0 && !types.some((type) => account.type === type)) {
		return callIfFn(props.fallback, 'NOT_ENOUGH_PERMISSION');
	}

	if (
		permissions.length > 0 &&
		!permissions.some((permission) => account.permissions.includes(permission))
	) {
		return callIfFn(props.fallback, 'NOT_ENOUGH_PERMISSION');
	}

	return props.children;
}

export function protected_<T extends object>(Component: ComponentType<T>, config?: ProtectedProps) {
	return (props: T) => {
		return (
			<Protected fallback={_403} {...config}>
				<Component {...props} />
			</Protected>
		);
	};
}

function _403() {
	const mutation = useDestroySessionMutation();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center py-32">
			<FeaturedIcon.Root accent="danger">
				<FeaturedIcon.Icon>
					<LockIcon />
				</FeaturedIcon.Icon>
			</FeaturedIcon.Root>
			<h1 className="mt-5 font-bold text-2xl">Access forbidden</h1>
			<p className="text-neutral-300">You don’t have the required permissions to view this page.</p>
			<Button
				type="button"
				variant="outline"
				onClick={async () => {
					await mutation.mutateAsync();
					queryClient.setQueryData(useCurrentAccountQuery.getQueryKey(), null);
					await delay(1);
					await navigate('/');
					queryClient.invalidateQueries({
						queryKey: [],
						exact: false,
						refetchType: 'active',
					});
				}}
				disabled={mutation.isPending}
				className="mt-5"
			>
				Sign out
			</Button>
		</div>
	);
}

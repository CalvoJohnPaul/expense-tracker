import type {AccountType, Permission} from '@expense-tracker/defs';
import type {ReactNode} from 'react';
import {useCurrentAccountQuery} from '~/hooks/useCurrentAccountQuery';
import {callIfFn} from '~/utils/callIfFn';

export interface ProtectedProps {
	type?: AccountType | [AccountType, ...AccountType[]];
	permission?: Permission | [Permission, ...Permission[]];
	loader?: ReactNode;
	fallback?:
		| ReactNode
		| ((reason: 'AUTHENTICATION_REQUIRED' | 'NOT_ENOUGH_PERMISSION') => ReactNode);
	children: ReactNode;
}

export function Protected(props: ProtectedProps): ReactNode {
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

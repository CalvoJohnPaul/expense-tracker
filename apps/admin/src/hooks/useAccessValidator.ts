import type {AccountType, Permission} from '@expense-tracker/defs';
import {useCurrentAccountQuery} from './useCurrentAccountQuery';

export interface TypeValidator {
	is: (arg: AccountType) => boolean;
	isOneOf: (arg: [AccountType, ...AccountType[]]) => boolean;
}

export interface PermissionValidator {
	has: (arg: Permission) => boolean;
	hasOneOf: (arg: [Permission, ...Permission[]]) => boolean;
	hasAllOf: (arg: [Permission, ...Permission[]]) => boolean;
}

export interface AccessValidator {
	type: TypeValidator;
	permission: PermissionValidator;
}

export function useAccessValidator(): AccessValidator {
	const accountQuery = useCurrentAccountQuery();
	const account = accountQuery.data ?? null;

	const type: TypeValidator = {
		is(arg) {
			return account != null && account.type === arg;
		},
		isOneOf(arg) {
			return account != null && arg.includes(account.type);
		},
	};

	const permission: PermissionValidator = {
		has(arg) {
			return account != null && account.permissions.includes(arg);
		},
		hasOneOf(arg) {
			return (
				account != null &&
				account.permissions.length > 0 &&
				account.permissions.some((permission) => arg.includes(permission))
			);
		},
		hasAllOf(arg) {
			return (
				account != null &&
				account.permissions.length > 0 &&
				account.permissions.every((permission) => arg.includes(permission))
			);
		},
	};

	return {
		type,
		permission,
	};
}

import type {ReactNode} from 'react';
import {useBreadcrumbsContext, type UseBreadcrumbsContext} from './useBreadcrumbContext';

export interface BreadcrumbsContextProps {
	children: (context: UseBreadcrumbsContext) => ReactNode;
}

export function Context(props: BreadcrumbsContextProps) {
	return props.children(useBreadcrumbsContext());
}

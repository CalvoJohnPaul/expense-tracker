import type {ReactNode} from 'react';
import type {ItemProps} from './useBreadcrumb';
import {useBreadcrumbsItemPropsContext} from './useBreadcrumbContext';

export interface BreadcrumbsItemContextProps {
	children: (context: ItemProps) => ReactNode;
}

export function ItemContext(props: BreadcrumbsItemContextProps) {
	return props.children(useBreadcrumbsItemPropsContext());
}

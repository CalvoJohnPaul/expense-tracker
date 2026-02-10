import type {ReactNode} from 'react';
import type {ItemProps} from './useBreadcrumbs';
import {useBreadcrumbsItemPropsContext} from './useBreadcrumbsContext';

export interface BreadcrumbsItemContextProps {
	children: (context: ItemProps) => ReactNode;
}

export function ItemContext(props: BreadcrumbsItemContextProps) {
	return props.children(useBreadcrumbsItemPropsContext());
}

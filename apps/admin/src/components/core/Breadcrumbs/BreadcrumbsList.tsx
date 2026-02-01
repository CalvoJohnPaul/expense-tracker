import type {HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {mergeProps} from '@ark-ui/react/utils';
import {forwardRef, useMemo} from 'react';
import {useBreadcrumbsContext} from './useBreadcrumbContext';

export interface BreadcrumbsListProps extends HTMLArkProps<'ol'> {}

export const List = forwardRef<HTMLOListElement, BreadcrumbsListProps>((props, ref) => {
	const breadcrumb = useBreadcrumbsContext();
	const mergedProps = useMemo(
		() => mergeProps(breadcrumb.getListProps(), props),
		[breadcrumb, props],
	);

	return <ark.ol ref={ref} {...mergedProps} />;
});

List.displayName = 'BreadcrumbList';

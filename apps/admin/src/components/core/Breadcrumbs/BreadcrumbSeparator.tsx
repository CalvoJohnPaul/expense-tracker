import type {HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {mergeProps} from '@ark-ui/react/utils';
import {forwardRef, useMemo} from 'react';
import {useBreadcrumbsContext} from './useBreadcrumbsContext';

export interface BreadcrumbsSeparatorProps extends HTMLArkProps<'li'> {}

export const Separator = forwardRef<HTMLLIElement, BreadcrumbsSeparatorProps>((props, ref) => {
	const breadcrumb = useBreadcrumbsContext();
	const mergedProps = useMemo(
		() => mergeProps(breadcrumb.getSeparatorProps(), props),
		[breadcrumb, props],
	);

	return <ark.li ref={ref} {...mergedProps} />;
});

Separator.displayName = 'BreadcrumbsSeparator';

import type {HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {mergeProps} from '@ark-ui/react/utils';
import {forwardRef, useMemo} from 'react';
import {useBreadcrumbs} from './useBreadcrumbs';
import {BreadcrumbsProvider} from './useBreadcrumbsContext';

export interface BreadcrumbsProps extends HTMLArkProps<'nav'> {}

export const Root = forwardRef<HTMLElement, BreadcrumbsProps>((props, ref) => {
	const breadcrumb = useBreadcrumbs();
	const mergedProps = useMemo(
		() => mergeProps(breadcrumb.getRootProps(), props),
		[breadcrumb, props],
	);

	return (
		<BreadcrumbsProvider value={breadcrumb}>
			<ark.nav ref={ref} {...mergedProps} />
		</BreadcrumbsProvider>
	);
});

Root.displayName = 'Breadcrumbs';

import type {Assign, HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {mergeProps} from '@ark-ui/react/utils';
import {forwardRef, useMemo} from 'react';
import {splitProps} from '~/utils/splitProps';
import type {LinkProps} from './useBreadcrumbs';
import {useBreadcrumbsContext, useBreadcrumbsItemPropsContext} from './useBreadcrumbsContext';

export interface BreadcrumbsLinkProps extends Assign<HTMLArkProps<'a'>, Pick<LinkProps, 'href'>> {}

export const Link = forwardRef<HTMLAnchorElement, BreadcrumbsLinkProps>((props, ref) => {
	const breadcrumb = useBreadcrumbsContext();

	const [linkProps, localProps] = useMemo(() => splitProps(props, 'href'), [props]);

	const itemProps = useBreadcrumbsItemPropsContext();

	const mergedProps = useMemo(
		() =>
			mergeProps(
				breadcrumb.getLinkProps({
					...itemProps,
					...linkProps,
				}),
				localProps,
			),
		[breadcrumb, itemProps, linkProps, localProps],
	);

	return <ark.a ref={ref} {...mergedProps} />;
});

Link.displayName = 'BreadcrumbsLink';

import type {Assign, HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {mergeProps} from '@ark-ui/react/utils';
import {forwardRef, useMemo} from 'react';
import {splitProps} from '~/utils/splitProps';
import {type ItemProps, useBreadcrumbs} from './useBreadcrumb';
import {BreadcrumbsItemPropsProvider} from './useBreadcrumbContext';

export interface BreadcrumbsItemProps extends Assign<HTMLArkProps<'li'>, ItemProps> {}

export const Item = forwardRef<HTMLLIElement, BreadcrumbsItemProps>((props, ref) => {
	const [itemProps, localProps] = useMemo(() => splitProps(props, 'currentPage'), [props]);

	const breadcrumb = useBreadcrumbs();

	const mergedProps = useMemo(
		() => mergeProps(breadcrumb.getItemProps(itemProps), localProps),
		[breadcrumb, itemProps, localProps],
	);

	return (
		<BreadcrumbsItemPropsProvider value={itemProps}>
			<ark.li ref={ref} {...mergedProps} />
		</BreadcrumbsItemPropsProvider>
	);
});

Item.displayName = 'BreadcrumbItem';

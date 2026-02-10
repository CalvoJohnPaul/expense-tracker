import type {HTMLArkProps} from '@ark-ui/react';
import {dataAttr} from '~/utils/dataAttr';
import {parts} from './Breadcrumbs.anatomy';

export interface ItemProps {
	currentPage?: boolean;
}

export interface LinkProps extends ItemProps {
	href?: string;
}

export interface UseBreadcrumbsReturn {
	getRootProps(): HTMLArkProps<'nav'>;
	getListProps(): HTMLArkProps<'ol'>;
	getItemProps(props: ItemProps): HTMLArkProps<'li'>;
	getLinkProps(props: LinkProps): HTMLArkProps<'a'>;
	getSeparatorProps(): HTMLArkProps<'li'>;
}

export function useBreadcrumbs(): UseBreadcrumbsReturn {
	function getRootProps(): HTMLArkProps<'nav'> {
		return {
			role: 'navigation',
			...parts.root.attrs,
		};
	}

	function getListProps(): HTMLArkProps<'ol'> {
		return {
			role: 'list',
			...parts.list.attrs,
		};
	}

	function getItemProps(props: ItemProps): HTMLArkProps<'li'> {
		const attrs: Record<string, string | undefined> = {
			'data-current': dataAttr(props.currentPage),
			'data-disabled': dataAttr(props.currentPage),
		};

		return {
			role: 'listitem',
			...attrs,
			...parts.item.attrs,
		};
	}

	function getLinkProps(props: LinkProps): HTMLArkProps<'a'> {
		const attrs: Record<string, string | undefined> = {
			'aria-current': props.currentPage ? 'page' : 'false',
			'data-current': dataAttr(props.currentPage),
			'data-disabled': dataAttr(props.currentPage),
		};

		return {
			role: 'link',
			href: props.currentPage ? undefined : props.href,
			...attrs,
			...parts.link.attrs,
		};
	}

	function getSeparatorProps(): HTMLArkProps<'li'> {
		return {
			'aria-hidden': true,
			...parts.separator.attrs,
		};
	}

	return {
		getRootProps,
		getListProps,
		getItemProps,
		getLinkProps,
		getSeparatorProps,
	};
}

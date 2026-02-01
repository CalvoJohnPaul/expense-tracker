import {createContext} from '@ark-ui/react/utils';
import type {ItemProps, UseBreadcrumbsReturn} from './useBreadcrumb';

export interface UseBreadcrumbsContext extends UseBreadcrumbsReturn {}

export const [BreadcrumbsProvider, useBreadcrumbsContext] = createContext<UseBreadcrumbsContext>();

export const [BreadcrumbsItemPropsProvider, useBreadcrumbsItemPropsContext] =
	createContext<ItemProps>();

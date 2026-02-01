import {ChevronRightIcon} from 'lucide-react';
import {Breadcrumbs} from '~/components/core/Breadcrumbs';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {breadcrumbsRecipe} from './Breadcrumbs.recipe';

const {withProvider, withContext} = createRecipeContext(breadcrumbsRecipe);

export const Root = withProvider(Breadcrumbs.Root, 'root');
export const Item = withContext(Breadcrumbs.Item, 'item');
export const Link = withContext(Breadcrumbs.Link, 'link');
export const List = withContext(Breadcrumbs.List, 'list');
export const Separator = withContext(Breadcrumbs.Separator, 'separator', {
	defaultProps: {
		children: <ChevronRightIcon />,
	},
});

import {tv} from 'tailwind-variants';
import {breadcrumbsAnatomy} from '~/components/core/Breadcrumbs';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const breadcrumbsRecipe = tv({
	slots: anatomyToRecipeSlots(breadcrumbsAnatomy, {
		root: 'flex items-center gap-2',
		list: 'inline-flex items-center gap-2',
		item: 'inline-flex items-center gap-1 font-medium ui-current:font-semibold text-neutral-400 text-sm ui-current:text-blue-400',
		link: 'inline-flex items-center',
		separator: 'inline-flex icon:size-4 items-center icon:text-neutral-400',
	}),
});

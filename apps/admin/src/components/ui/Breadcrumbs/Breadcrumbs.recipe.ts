import {tv} from 'tailwind-variants';
import {breadcrumbAnatomy} from '~/components/core/Breadcrumbs';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const breadcrumbsRecipe = tv({
	slots: anatomyToRecipeSlots(breadcrumbAnatomy, {
		root: 'flex items-center gap-2',
		list: 'inline-flex items-center gap-2',
		item: 'inline-flex items-center gap-1 font-medium ui-current:font-semibold text-neutral-400 text-sm ui-current:text-emerald-400',
		link: 'inline-flex items-center',
		separator: 'inline-flex icon:size-4 items-center icon:text-neutral-400',
	}),
});

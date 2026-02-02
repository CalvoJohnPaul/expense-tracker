import {paginationAnatomy} from '@ark-ui/react';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';
import {tw} from '~/utils/tw';

const trigger = tw`h-11 min-w-11 px-2 flex items-center justify-center border bg-neutral-900 rounded-lg text-center font-semibold focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:opacity-50 icon:size-6 ui-selected:border-blue-700 ui-selected:text-blue-300 ui-selected:bg-blue-700/10`;

export const paginationRecipe = tv({
	slots: anatomyToRecipeSlots(paginationAnatomy, {
		root: 'flex gap-2',
		ellipsis: 'flex icon:size-4 size-11 items-center justify-center text-neutral-400',
		item: trigger,
		firstTrigger: trigger,
		lastTrigger: trigger,
		nextTrigger: trigger,
		prevTrigger: trigger,
	}),
});

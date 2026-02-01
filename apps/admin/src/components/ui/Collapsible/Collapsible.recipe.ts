import {collapsibleAnatomy} from '@ark-ui/react/collapsible';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const collapsibleRecipe = tv({
	slots: anatomyToRecipeSlots(collapsibleAnatomy, {
		indicator: 'ui-open:rotate-180 transition-transform',
	}),
	variants: {
		axis: {
			x: {
				root: 'flex items-start',
				trigger: 'shrink-0',
				content: 'ui-closed:animate-collapse-x-out ui-open:animate-collapse-x-in overflow-hidden',
			},
			y: {
				content: 'ui-closed:animate-collapse-out ui-open:animate-collapse-in overflow-hidden',
			},
		},
	},
	defaultVariants: {
		axis: 'y',
	},
});

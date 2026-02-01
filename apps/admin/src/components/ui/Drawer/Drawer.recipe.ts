import {dialogAnatomy} from '@ark-ui/react/dialog';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

const anatomy = dialogAnatomy.rename('drawer').extendWith('header', 'footer', 'body');

export const drawerRecipe = tv({
	slots: anatomyToRecipeSlots(anatomy, {
		backdrop:
			'fixed inset-0 z-backdrop ui-closed:animate-backdrop-out ui-open:animate-backdrop-in bg-black/75 backdrop-blur-xs',
		positioner: 'fixed inset-0 z-drawer',
		content: [
			'fixed',
			'top-0',
			'right-0',
			'z-drawer',
			'h-full',
			'w-96',
			'ui-closed:animate-drawer-out',
			'ui-open:animate-drawer-in',
			'bg-neutral-900',
		],
	}),
	variants: {
		placement: {
			left: {
				content: 'left-0 ui-closed:animate-drawer-out-left ui-open:animate-drawer-in-left border-r',
			},
			right: {
				content:
					'right-0 ui-closed:animate-drawer-out-right ui-open:animate-drawer-in-right border-l',
			},
		},
	},
	defaultVariants: {
		placement: 'right',
	},
});

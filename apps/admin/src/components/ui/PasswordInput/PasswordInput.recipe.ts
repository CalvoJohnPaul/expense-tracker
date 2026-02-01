import {passwordInputAnatomy} from '@ark-ui/react/password-input';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const passwordInputRecipe = tv({
	slots: anatomyToRecipeSlots(passwordInputAnatomy, {
		control: [
			'flex',
			'rounded-lg',
			'border',
			'bg-neutral-900',
			'ui-invalid:border-red-400',
			'ui-invalid:focus-within:outline-red-400',
			'focus-within:outline-2',
			'focus-within:outline-solid',
			'focus-within:outline-emerald-600',
			'focus-within:-outline-offset-1',
		],
		input: 'h-11 grow px-4 outline-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden',
		visibilityTrigger: 'flex icon:size-5 size-11 shrink-0 items-center justify-center',
		indicator: 'text-neutral-300',
	}),
});

import {fieldAnatomy} from '@ark-ui/react/field';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const fieldRecipe = tv({
	slots: anatomyToRecipeSlots(fieldAnatomy, {
		input: [
			'h-11',
			'px-4',
			'block',
			'w-full',
			'rounded-lg',
			'border',
			'focus:outline-2',
			'focus:outline-solid',
			'focus:outline-blue-600',
			'focus:-outline-offset-1',
			'ui-invalid:border-red-400',
			'ui-invalid:focus:outline-red-400',
			'bg-neutral-900',
		],
		textarea: [
			'p-4',
			'block',
			'w-full',
			'rounded-lg',
			'border',
			'focus:outline-2',
			'focus:outline-solid',
			'focus:outline-blue-600',
			'focus:-outline-offset-1',
			'ui-invalid:border-red-400',
			'ui-invalid:focus:outline-red-400',
		],
		label: 'mb-1.5 flex items-center gap-1.5 font-medium text-neutral-300 text-sm',
		helperText: 'mt-1.5 text-neutral-300/80 text-xs',
		requiredIndicator: 'text-red-400 text-sm',
		errorText: 'mt-1.5 text-red-400 text-sm',
	}),
});

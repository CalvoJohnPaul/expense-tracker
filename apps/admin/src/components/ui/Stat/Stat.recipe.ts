import {tv} from 'tailwind-variants';

export const statRecipe = tv({
	slots: {
		root: 'inline-block',
		label: 'block text-neutral-400 text-sm',
		valueText: 'mt-1 block font-semibold text-2xl',
		helpText: 'mt-1 flex items-center gap-1 text-neutral-400 text-xs',
		upIndicator: 'mt-1 flex icon:size-4 items-center gap-2 text-emerald-400 text-xs',
		downIndicator: 'mt-1 flex icon:size-4 items-center gap-2 text-rose-400 text-xs',
	},
});

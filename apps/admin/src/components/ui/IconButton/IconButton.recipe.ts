import {tv} from 'tailwind-variants';

export const iconButtonRecipe = tv({
	base: [
		'flex',
		'items-center',
		'justify-center',
		'border',
		'bg-neutral-900',
		'rounded-lg',
		'focus-visible:outline-2',
		'focus-visible:outline-solid',
		'focus-visible:outline-offset-2',
		'focus-visible:outline-white/50',
		'disabled:opacity-50',
	],
	variants: {
		size: {
			sm: 'icon:size-5 size-10',
			md: 'icon:size-6 size-11',
			lg: 'icon:size-7 size-12',
			xl: 'icon:size-8 size-14',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

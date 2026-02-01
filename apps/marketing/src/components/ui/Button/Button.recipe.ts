import {tv, type VariantProps} from 'tailwind-variants';

export const buttonRecipe = tv({
	base: [
		'flex',
		'items-center',
		'justify-center',
		'gap-1.5',
		'rounded-lg',
		'text-center',
		'font-semibold',
		'focus-visible:outline-2',
		'focus-visible:outline-solid',
		'focus-visible:outline-offset-2',
		'focus-visible:outline-white',
		'disabled:opacity-50',
	],
	variants: {
		size: {
			md: 'h-11 px-4 text-base',
			lg: 'h-12 px-4.5 text-base',
		},
		variant: {
			solid: 'bg-emerald-600 text-white',
			subtle: 'bg-neutral-800',
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'solid',
	},
});

export type ButtonRecipeProps = VariantProps<typeof buttonRecipe>;

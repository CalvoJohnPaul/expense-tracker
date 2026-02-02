import {tv} from 'tailwind-variants';

export const buttonRecipe = tv({
	base: [
		'h-11',
		'px-4',
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
		'focus-visible:outline-white/50',
		'disabled:opacity-50',
		'icon:size-6',
	],
	variants: {
		accent: {
			primary: '',
			danger: '',
			warning: '',
		},
		variant: {
			solid: '',
			outline: '',
		},
	},
	compoundVariants: [
		{
			variant: 'solid',
			accent: 'primary',
			className: 'bg-blue-600 text-white',
		},
		{
			variant: 'solid',
			accent: 'danger',
			className: 'bg-rose-600 text-white',
		},
		{
			variant: 'solid',
			accent: 'warning',
			className: 'bg-amber-600 text-white',
		},
		{
			variant: 'outline',
			accent: 'primary',
			className: 'border bg-neutral-900',
		},
	],
	defaultVariants: {
		variant: 'solid',
		accent: 'primary',
	},
});

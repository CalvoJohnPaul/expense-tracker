import {tv} from 'tailwind-variants';

export const featuredIconRecipe = tv({
	slots: {
		root: [
			'relative',
			'flex',
			'shrink-0',
			'items-center',
			'justify-center',
			'rounded-xl',
			'before:absolute',
			'before:right-0',
			'before:z-2',
			'before:rounded-lg',
			'after:absolute',
			'after:z-1',
			'after:rounded-lg',
		],
		icon: 'z-3',
	},
	variants: {
		size: {
			sm: {
				root: 'mr-2 size-10 before:size-10 after:-top-1 after:-right-1.5 after:size-10 after:rotate-12',
				icon: 'size-6',
			},
			md: {
				root: 'mr-2 size-12 before:size-12 after:-top-2 after:-right-2 after:size-12 after:rotate-15',
				icon: 'size-8',
			},
		},
		accent: {
			success: {
				root: 'before:bg-green-700 after:bg-green-400/25',
				icon: 'text-green-200',
			},
			danger: {
				root: 'before:bg-rose-700 after:bg-rose-400/25',
				icon: 'text-rose-200',
			},
			warning: {
				root: 'before:bg-amber-700 after:bg-amber-400/25',
				icon: 'text-amber-200',
			},
			info: {
				root: 'before:bg-purple-700 after:bg-purple-400/25',
				icon: 'text-purple-200',
			},
		},
	},
	defaultVariants: {
		size: 'md',
		accent: 'info',
	},
});

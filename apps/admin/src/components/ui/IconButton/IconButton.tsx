import type {Assign, HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {forwardRef, useMemo} from 'react';
import type {VariantProps} from 'tailwind-variants';
import {splitProps} from '~/utils/splitProps';
import {iconButtonRecipe} from './IconButton.recipe';

export interface IconButtonProps
	extends Assign<HTMLArkProps<'button'>, VariantProps<typeof iconButtonRecipe>> {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
	const [recipeProps, localProps] = useMemo(
		() => splitProps(props, ...iconButtonRecipe.variantKeys),
		[props],
	);

	return (
		<ark.button
			ref={ref}
			type="button"
			{...localProps}
			className={iconButtonRecipe({
				...recipeProps,
				className: localProps.className,
			})}
		/>
	);
});

IconButton.displayName = 'IconButton';

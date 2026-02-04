import {ark} from '@ark-ui/react';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {statRecipe} from './Stat.recipe';

const {withContext, withProvider} = createRecipeContext(statRecipe);

export const Root = withProvider(ark.div, 'root');
export const Label = withContext(ark.span, 'label');
export const ValueText = withContext(ark.span, 'valueText');
export const HelpText = withContext(ark.span, 'helpText');
export const UpIndicator = withContext(ark.span, 'upIndicator');
export const DownIndicator = withContext(ark.span, 'downIndicator');

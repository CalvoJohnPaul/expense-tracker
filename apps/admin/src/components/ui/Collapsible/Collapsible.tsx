import {Collapsible} from '@ark-ui/react/collapsible';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {collapsibleRecipe} from './Collapsible.recipe';

const {withProvider, withContext} = createRecipeContext(collapsibleRecipe);

export const Root = withProvider(Collapsible.Root, 'root', {
	defaultProps: {
		lazyMount: true,
	},
});
export const RootProvider = withProvider(Collapsible.RootProvider, 'root');
export const Content = withContext(Collapsible.Content, 'content');
export const Trigger = withContext(Collapsible.Trigger, 'trigger');
export const Indicator = withContext(Collapsible.Indicator, 'indicator', {
	defaultProps: {
		asChild: true,
	},
});
export const Context = Collapsible.Context;

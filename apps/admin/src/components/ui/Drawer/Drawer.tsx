import {Dialog} from '@ark-ui/react/dialog';
import {ark} from '@ark-ui/react/factory';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {drawerRecipe} from './Drawer.recipe';

const {withRootProvider, withContext} = createRecipeContext(drawerRecipe);

export const Root = withRootProvider(Dialog.Root, {
	defaultProps: {
		role: 'dialog',
		lazyMount: true,
	},
});
export const Backdrop = withContext(Dialog.Backdrop, 'backdrop');
export const CloseTrigger = withContext(Dialog.CloseTrigger, 'closeTrigger');
export const Content = withContext(Dialog.Content, 'content');
export const Description = withContext(Dialog.Description, 'description');
export const Positioner = withContext(Dialog.Positioner, 'positioner');
export const Title = withContext(Dialog.Title, 'title');
export const Trigger = withContext(Dialog.Trigger, 'trigger');
export const Header = withContext(ark.section, 'header');
export const Body = withContext(ark.section, 'body');
export const Footer = withContext(ark.section, 'footer');
export const Context = Dialog.Context;

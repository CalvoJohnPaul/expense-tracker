import {createAnatomy} from '@ark-ui/react/anatomy';

export const anatomy = createAnatomy('breadcrumbs').parts(
	'root',
	'list',
	'item',
	'link',
	'separator',
);

export const parts = anatomy.build();

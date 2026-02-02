import {tv} from 'tailwind-variants';
import {wysiwygAnatomy} from '~/components/core/Wysiwyg';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';
import {tw} from '~/utils/tw';

const trigger = tw`p-1 rounded transition-colors duration-200 ui-pressed:bg-neutral-700/25 icon:size-4`;

export const wysiwygRecipe = tv({
	slots: anatomyToRecipeSlots(wysiwygAnatomy, {
		root: [
			'relative',
			'rounded-lg',
			'border',
			'focus-within:outline-2',
			'focus-within:outline-solid',
			'focus-within:outline-blue-600',
			'focus-within:-outline-offset-1',
			'ui-invalid:border-red-400',
			'ui-invalid:focus-within:outline-red-400',
		],
		control: 'flex items-center gap-1 rounded-t-lg border-b p-1.5',
		content: [
			'tiptap:rounded-b-lg',

			'tiptap:min-h-32',
			'tiptap:max-h-48',
			'tiptap:overflow-y-auto',

			'max-w-full',
			'min-w-full',

			'prose',
			'prose-md',
			'prose-neutral',
			'prose-invert',
			'prose-h1:text-[1.625rem]!',
			'prose-h2:text-[1.5rem]!',
			'prose-h3:text-[1.375rem]!',
			'prose-h4:text-[1.25rem]!',
			'prose-h5:text-[1.125rem]!',
			'prose-h6:text-[1rem]!',

			'**:m-0',
			'[&_u]:underline-offset-3',

			'**:leading-normal',
			'**:after:leading-normal',
			'**:before:leading-normal',
			'**:marker:leading-normal',

			'tiptap:px-4',
			'tiptap:py-3',
			'tiptap:scrollbar:bg-transparent',
			'tiptap:scrollbar-thumb:bg-neutral-700',
			'tiptap:scrollbar-thumb:border-4',
			'tiptap:scrollbar-thumb:border-transparent',
			'tiptap:scrollbar-thumb:bg-clip-padding',
			'tiptap:scrollbar-thumb:rounded-full',

			'tiptap:[&_p.is-empty]:relative',
			'tiptap:[&_p.is-empty]:before:absolute',
			'tiptap:[&_p.is-empty]:before:content-[attr(data-placeholder)]',
			'tiptap:[&_p.is-empty]:before:pointer-events-none',
			'tiptap:[&_p.is-empty]:before:text-neutral-400',
			'tiptap:[&_p.is-empty]:text-md',
		],
		blockquoteTrigger: trigger,
		boldTrigger: trigger,
		bulletListTrigger: trigger,
		codeBlockTrigger: trigger,
		hardBreakTrigger: trigger,
		headingTrigger: trigger,
		imageTrigger: trigger,
		italicTrigger: trigger,
		linkTrigger: trigger,
		orderedListTrigger: trigger,
		redoTrigger: trigger,
		strikeTrigger: trigger,
		textAlignTrigger: trigger,
		underlineTrigger: trigger,
		undoTrigger: trigger,
		charactersCount:
			'pointer-events-none absolute right-2 bottom-2 mr-1 ml-auto text-neutral-400 text-xs',
	}),
});

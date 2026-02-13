import {Presence, useFieldContext} from '@ark-ui/react';
import type {UploadedFile} from '@expense-tracker/defs';
import {useControllableState} from '@radix-ui/react-use-controllable-state';
import {XIcon} from 'lucide-react';
import {useRef} from 'react';
import {twMerge} from 'tailwind-merge';
import {SpinnerIcon} from '~/components/icons/SpinnerIcon';
import {Button} from '~/components/ui/Button';
import {Tooltip} from '~/components/ui/Tooltip';
import {queryClient} from '~/config/queryClient';
import {API_URL} from '~/constants';
import {useUploadedFileQuery} from '~/hooks/useUploadedFileQuery';
import {useUploadFileMutation} from '~/hooks/useUploadFileMutation';
import {dataAttr} from '~/utils/dataAttr';

export interface ReceiptFieldProps {
	value?: number | null;
	onChange?: (value: number | null) => void;
	defaultValue?: number | null;
	invalid?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	className?: string;
}

export function ReceiptField(props: ReceiptFieldProps) {
	const [value, setValue] = useControllableState({
		prop: props.value,
		onChange: props.onChange,
		defaultProp: props.defaultValue ?? null,
	});

	const field = useFieldContext();
	const query = useUploadedFileQuery(value ?? -1, {enabled: value != null && value > 0});
	const mutation = useUploadFileMutation();
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div
			className={twMerge(
				props.className,
				'relative',
				'rounded-lg',
				'border',
				'focus:outline-2',
				'focus:outline-solid',
				'ui-invalid:border-red-400',
				'ui-invalid:focus:outline-red-400',
				'bg-neutral-900',
			)}
			data-invalid={dataAttr(field?.invalid ?? props.invalid)}
			data-disabled={dataAttr(field?.disabled ?? props.disabled)}
			data-readonly={dataAttr(field?.readOnly ?? props.readOnly)}
			data-required={dataAttr(field?.required ?? props.required)}
		>
			<Presence
				present={
					value != null &&
					!field?.disabled &&
					!props.disabled &&
					!field?.readOnly &&
					!props.readOnly
				}
			>
				<Tooltip.Root>
					<Tooltip.Trigger
						type="button"
						className="absolute top-2 right-2 grid size-7 transform place-items-center rounded-full bg-neutral-900/25 text-white"
						onClick={() => {
							setValue(null);
						}}
					>
						<XIcon className="size-4" />
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Content>
							<Tooltip.Arrow>
								<Tooltip.ArrowTip />
							</Tooltip.Arrow>
							Remove
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			</Presence>

			{query.isLoading && (
				<div className="p-4">
					<SpinnerIcon className="size-6" />
				</div>
			)}

			{!query.isLoading && query.data != null && (
				<div className="p-4">
					<img src={`${API_URL}${query.data.src}`} alt="" className="mx-auto max-h-64" />
				</div>
			)}

			{!query.isLoading && query.data == null && (
				<div className="px-4 py-6">
					<h2 className="mt-3 text-center font-semibold text-neutral-100">Choose file</h2>
					<p className="text-center text-neutral-400">Upload image or scan a receipt</p>

					<Button
						variant="outline"
						className="mx-auto mt-3 w-24"
						disabled={
							mutation.isPending ||
							props.disabled ||
							field?.disabled ||
							props.readOnly ||
							field?.readOnly
						}
						onClick={() => {
							inputRef.current?.click();
						}}
					>
						Upload
					</Button>
				</div>
			)}

			{!field?.readOnly && !props.readOnly && !field?.disabled && !props.disabled && (
				<input
					ref={inputRef}
					id={field?.ids?.control}
					type="file"
					accept="image/jpg, image/png, image/jpeg, image/webp, image/svg+xml"
					max="2097152" /* 2MB */
					hidden
					onChange={async (e) => {
						const file = e.target.files?.[0];
						if (!file) return;
						const data = await mutation.mutateAsync(file);
						queryClient.setQueryData<UploadedFile>(useUploadedFileQuery.getQueryKey(data.id), data);
						setValue(data.id);
						if (inputRef.current) inputRef.current.value = '';
					}}
				/>
			)}
		</div>
	);
}

import {useFieldContext} from '@ark-ui/react';
import {PermissionDefinition, type Permission} from '@expense-tracker/defs';
import {useControllableState} from '@radix-ui/react-use-controllable-state';
import {uniq} from 'es-toolkit';
import {twMerge} from 'tailwind-merge';
import {CheckField} from '~/components/forms/CheckField';
import {Field} from '~/components/ui/Field';
import {dataAttr} from '~/utils/dataAttr';

export interface PermissionFieldProps {
	value?: Permission[];
	defaultValue?: Permission[];
	onChange?: (value: Permission[]) => void;
	invalid?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	className?: string;
}

export function PermissionField(props: PermissionFieldProps) {
	const field = useFieldContext();

	const [value, setValue] = useControllableState({
		prop: props.value,
		defaultProp: props.defaultValue ?? [],
		onChange: props.onChange,
	});

	return (
		<div
			className={twMerge(
				'space-y-2 rounded-lg border border-neutral-800/25 ui-invalid:border-red-400 bg-neutral-800/25 p-4',
				props.className,
			)}
			data-invalid={dataAttr(field?.invalid || props.invalid)}
			data-required={dataAttr(field?.required || props.required)}
			data-readonly={dataAttr(field?.readOnly || props.readOnly)}
			data-disabled={dataAttr(field?.disabled || props.disabled)}
			aria-describedby={field?.ariaDescribedby}
		>
			{PermissionDefinition.options.map((permission) => (
				<Field.Root key={permission} className="flex items-center gap-2">
					<CheckField
						value={value.includes(permission)}
						onChange={(value) => {
							if (value) {
								setValue((prev) => uniq([...prev, permission]));
							} else {
								setValue((prev) => prev.filter((p) => p !== permission));
							}
						}}
						disabled={field?.readOnly || props.disabled}
						readOnly={field?.readOnly || props.readOnly}
					>
						<span className="text-neutral-300 text-sm">{permission.replace(/_/g, ' ')}</span>
					</CheckField>
				</Field.Root>
			))}
		</div>
	);
}

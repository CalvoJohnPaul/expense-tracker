import {useControllableState} from '@radix-ui/react-use-controllable-state';

export interface ImageFieldProps {
	value?: number | null;
	defaultValue?: number | null;
	onChange?: (value: number | null) => void;
	readOnly?: boolean;
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
	className?: string;
}

export function ImageField(props: ImageFieldProps) {
	const [value, setValue] = useControllableState({
		prop: props.value,
		defaultProp: props.defaultValue ?? null,
		onChange: props.onChange,
	});

	return null;
}

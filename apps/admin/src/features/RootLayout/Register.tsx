import {CreateAccountInputDefinition} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from 'react-hook-form';
import {PasswordField} from '~/components/forms/PasswordField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useCreateSessionMutation} from '~/hooks/useCreateSessionMutation';
import {useCurrentAccountQuery} from '~/hooks/useCurrentAccountQuery';
import {useRegisterAccountMutation} from '~/hooks/useRegisterAccountMutation';

export function Register() {
	const createSessionMutation = useCreateSessionMutation();
	const registerAccountMutation = useRegisterAccountMutation();

	const form = useForm({
		resolver: zodResolver(
			CreateAccountInputDefinition.omit({
				type: true,
				permissions: true,
			}),
		),
		defaultValues: {
			name: '',
			email: '',
			avatar: null,
			password: '',
		},
	});

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit(async (data) => {
				try {
					await registerAccountMutation.mutateAsync(data);
					await createSessionMutation.mutateAsync(data);
					await queryClient.invalidateQueries({
						queryKey: useCurrentAccountQuery.getQueryKey(),
					});
				} catch (error) {
					toaster.error({
						description: error instanceof Error ? error.message : 'Failed to create account',
					});
				}
			})}
		>
			<Controller
				control={form.control}
				name="name"
				render={(ctx) => (
					<Field.Root invalid={ctx.fieldState.invalid}>
						<Field.Label>Name</Field.Label>
						<TextField
							placeholder="Enter name"
							value={ctx.field.value}
							onChange={ctx.field.onChange}
						/>
						<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
					</Field.Root>
				)}
			/>
			<Controller
				control={form.control}
				name="email"
				render={(ctx) => (
					<Field.Root className="mt-4" invalid={ctx.fieldState.invalid}>
						<Field.Label>Email</Field.Label>
						<TextField
							type="email"
							placeholder="Enter email"
							value={ctx.field.value}
							onChange={ctx.field.onChange}
						/>
						<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
					</Field.Root>
				)}
			/>
			<Controller
				control={form.control}
				name="password"
				render={(ctx) => (
					<Field.Root className="mt-4" invalid={ctx.fieldState.invalid}>
						<Field.Label>Password</Field.Label>
						<PasswordField
							placeholder="Enter password"
							value={ctx.field.value}
							onChange={ctx.field.onChange}
						/>
						<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
					</Field.Root>
				)}
			/>

			<Button type="submit" className="mt-8 w-full" disabled={form.formState.isSubmitting}>
				Sign Up
			</Button>
		</form>
	);
}

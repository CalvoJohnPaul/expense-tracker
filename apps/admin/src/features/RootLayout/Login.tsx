import {CreateSessionInputDefinition} from '@expense-tracker/defs';
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
import {ForgotPassword} from './ForgotPassword';

export function Login() {
	const mutation = useCreateSessionMutation();

	const form = useForm({
		resolver: zodResolver(CreateSessionInputDefinition),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	return (
		<form
			noValidate
			onSubmit={form.handleSubmit(async (data) => {
				try {
					await mutation.mutateAsync(data);
					await queryClient.invalidateQueries({
						queryKey: useCurrentAccountQuery.getQueryKey(),
					});
				} catch {
					toaster.error({
						description: 'Invalid credentials',
					});
				}
			})}
		>
			<Controller
				control={form.control}
				name="email"
				render={(ctx) => (
					<Field.Root invalid={ctx.fieldState.invalid}>
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
						<div className="mb-1.5 flex items-center">
							<Field.Label className="mb-0 grow">Password</Field.Label>
							<ForgotPassword />
						</div>
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
				Sign In
			</Button>
		</form>
	);
}

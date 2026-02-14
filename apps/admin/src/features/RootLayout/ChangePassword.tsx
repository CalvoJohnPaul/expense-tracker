import {Portal} from '@ark-ui/react';
import {ChangePasswordInputDefinition} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {invariant} from 'es-toolkit';
import {LockIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import * as z from 'zod';
import {PasswordField} from '~/components/forms/PasswordField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {Menu} from '~/components/ui/Menu';
import {toaster} from '~/config/toaster';
import {useChangePasswordMutation} from '~/hooks/useChangePasswordMutation';
import {useCurrentAccountQuery} from '~/hooks/useCurrentAccountQuery';
import {useDisclosure} from '~/hooks/useDisclosure';

export function ChangePassword() {
	const query = useCurrentAccountQuery();
	const mutation = useChangePasswordMutation();
	const disclosure = useDisclosure();

	const form = useForm({
		resolver: zodResolver(
			ChangePasswordInputDefinition.extend({
				confirmPassword: z.string(),
			}).superRefine((val, ctx) => {
				if (val.newPassword !== val.confirmPassword) {
					ctx.addIssue({
						code: 'custom',
						path: ['confirmPassword'],
						message: "Passwords don't match",
					});
				}
			}),
		),
		defaultValues: {
			newPassword: '',
			oldPassword: '',
			confirmPassword: '',
		},
	});

	return (
		<Dialog.Root
			open={disclosure.open}
			onOpenChange={(details) => {
				disclosure.setOpen(details.open);
			}}
			onExitComplete={() => {
				form.reset();
			}}
		>
			<Menu.Item
				value="change-password"
				onSelect={() => {
					disclosure.setOpen(true);
				}}
			>
				<LockIcon />
				Change password
			</Menu.Item>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-116 max-w-116" asChild>
						<form
							noValidate
							onSubmit={form.handleSubmit(async (data) => {
								invariant(query.data, "Account is 'null'");

								try {
									await mutation.mutateAsync(data);
									disclosure.setOpen(false);
									toaster.success({
										description: 'Changes saved',
									});
								} catch (error) {
									toaster.error({
										description: error instanceof Error ? error.message : 'Something went wrong.',
									});
								}
							})}
						>
							<Dialog.Header>
								<FeaturedIcon.Root>
									<FeaturedIcon.Icon>
										<LockIcon />
									</FeaturedIcon.Icon>
								</FeaturedIcon.Root>
								<div>
									<Dialog.Title>Change password</Dialog.Title>
									<Dialog.Description>Fill out the form to change your password</Dialog.Description>
								</div>
								<Dialog.CloseTrigger />
							</Dialog.Header>
							<Dialog.Body className="space-y-3">
								<Controller
									control={form.control}
									name="oldPassword"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Current password</Field.Label>
											<PasswordField
												placeholder="Enter current password"
												value={ctx.field.value}
												onChange={ctx.field.onChange}
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="newPassword"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>New password</Field.Label>
											<PasswordField
												placeholder="Enter new password"
												value={ctx.field.value}
												onChange={ctx.field.onChange}
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="confirmPassword"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Confirm password</Field.Label>
											<PasswordField
												placeholder="Confirm new password"
												value={ctx.field.value}
												onChange={ctx.field.onChange}
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
							</Dialog.Body>
							<Dialog.Footer>
								<Button
									variant="outline"
									onClick={() => {
										disclosure.setOpen(false);
									}}
									disabled={form.formState.isSubmitting}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									Save
								</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

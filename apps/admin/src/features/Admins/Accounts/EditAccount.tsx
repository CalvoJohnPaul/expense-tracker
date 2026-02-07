import {Portal} from '@ark-ui/react';
import {type Account, UpdateAccountDataInputDefinition} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {EditIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import {AvatarField} from '~/components/forms/AvatarField';
import {PasswordField} from '~/components/forms/PasswordField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {Menu} from '~/components/ui/Menu';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useAccountAggregateQuery} from '~/hooks/useAccountAggregateQuery';
import {useAccountQuery} from '~/hooks/useAccountQuery';
import {useAccountsQuery} from '~/hooks/useAccountsQuery';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useUpdateAccountMutation} from '~/hooks/useUpdateAccountMutation';
import {useAccountContext} from './AccountsContext';
import {PermissionField} from './PermissionField';

export function EditAccount() {
	const account = useAccountContext();
	const mutation = useUpdateAccountMutation();
	const disclosure = useDisclosure({
		onChange(open) {
			if (open) {
				form.reset({
					name: account.name,
					email: account.email,
					avatar: account.avatar ?? null,
					password: '',
					permissions: account.permissions,
				});
			}
		},
	});

	const form = useForm({
		resolver: zodResolver(UpdateAccountDataInputDefinition),
		defaultValues: {
			name: '',
			email: '',
			avatar: null,
			password: '',
			permissions: [],
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
				value="edit"
				onSelect={() => {
					disclosure.setOpen(true);
				}}
			>
				<EditIcon /> Edit
			</Menu.Item>

			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-116 max-w-116" asChild>
						<form
							noValidate
							onSubmit={form.handleSubmit(async (data) => {
								try {
									const updated = await mutation.mutateAsync({
										id: account.id,
										data,
									});

									queryClient.setQueryData<Account | null>(
										useAccountQuery.getQueryKey(account.id),
										updated,
									);

									queryClient.invalidateQueries({
										queryKey: useAccountsQuery.getQueryKey(),
										type: 'all',
										exact: false,
										refetchType: 'active',
									});

									queryClient.invalidateQueries({
										queryKey: useAccountAggregateQuery.getQueryKey(),
										type: 'all',
										exact: false,
										refetchType: 'active',
									});

									disclosure.setOpen(false);
									toaster.success({
										description: 'Admin has been updated',
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
										<EditIcon />
									</FeaturedIcon.Icon>
								</FeaturedIcon.Root>
								<div>
									<Dialog.Title>Edit admin</Dialog.Title>
									<Dialog.Description>Fill out the form to edit admin</Dialog.Description>
								</div>
								<Dialog.CloseTrigger />
							</Dialog.Header>
							<Dialog.Body className="space-y-3">
								<Controller
									control={form.control}
									name="avatar"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Avatar</Field.Label>
											<AvatarField
												value={ctx.field.value}
												onChange={(value) => {
													ctx.field.onChange(value);
													form.trigger('avatar');
												}}
												onError={(message) => {
													form.setError('avatar', {message});
												}}
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="name"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Name</Field.Label>
											<TextField
												value={ctx.field.value}
												onChange={ctx.field.onChange}
												placeholder="Enter name"
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="email"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Email</Field.Label>
											<TextField
												type="email"
												value={ctx.field.value}
												onChange={ctx.field.onChange}
												placeholder="Enter email"
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="password"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Password</Field.Label>
											<PasswordField
												value={ctx.field.value}
												onChange={ctx.field.onChange}
												placeholder="Enter password"
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="permissions"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Permissions</Field.Label>
											<PermissionField value={ctx.field.value} onChange={ctx.field.onChange} />
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
									Update
								</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

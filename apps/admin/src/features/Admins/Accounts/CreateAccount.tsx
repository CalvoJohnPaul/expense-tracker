import {Portal} from '@ark-ui/react';
import {type Account, CreateAccountInputDefinition} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {PlusIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import {AvatarField} from '~/components/forms/AvatarField';
import {PasswordField} from '~/components/forms/PasswordField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {IconButton} from '~/components/ui/IconButton';
import {Tooltip} from '~/components/ui/Tooltip';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useAccountAggregateQuery} from '~/hooks/useAccountAggregateQuery';
import {useAccountQuery} from '~/hooks/useAccountQuery';
import {useAccountsQuery} from '~/hooks/useAccountsQuery';
import {useCreateAccountMutation} from '~/hooks/useCreateAccountMutation';
import {useDisclosure} from '~/hooks/useDisclosure';
import {PermissionField} from './PermissionField';

export function CreateAccount() {
	const mutation = useCreateAccountMutation();
	const disclosure = useDisclosure();

	const form = useForm({
		resolver: zodResolver(CreateAccountInputDefinition),
		defaultValues: {
			type: 'ADMIN',
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
			<Tooltip.Root positioning={{placement: 'bottom'}}>
				<Tooltip.Trigger asChild>
					<IconButton onClick={() => disclosure.setOpen(true)}>
						<PlusIcon />
					</IconButton>
				</Tooltip.Trigger>
				<Tooltip.Positioner>
					<Tooltip.Content>
						<Tooltip.Arrow>
							<Tooltip.ArrowTip />
						</Tooltip.Arrow>
						Add
					</Tooltip.Content>
				</Tooltip.Positioner>
			</Tooltip.Root>

			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-116 max-w-116" asChild>
						<form
							noValidate
							onSubmit={form.handleSubmit(async (data) => {
								try {
									const account = await mutation.mutateAsync(data);

									queryClient.setQueryData<Account | null>(
										useAccountQuery.getQueryKey(account.id),
										account,
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
										description: 'Account has been created',
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
										<PlusIcon />
									</FeaturedIcon.Icon>
								</FeaturedIcon.Root>
								<div>
									<Dialog.Title>Create admin</Dialog.Title>
									<Dialog.Description>Fill out the form to create admin</Dialog.Description>
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
									Create
								</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

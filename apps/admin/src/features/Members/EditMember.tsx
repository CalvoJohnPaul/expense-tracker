import {Portal} from '@ark-ui/react';
import {type Account, UpdateAccountDataInputDefinition} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {EditIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
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
import {useMemberContext} from './MembersContext';

export function EditMember() {
	const member = useMemberContext();
	const mutation = useUpdateAccountMutation();
	const disclosure = useDisclosure({
		onChange(open) {
			if (open) {
				form.reset({
					name: member.name,
					email: member.email,
					avatar: member.avatar ?? null,
					password: '',
					permissions: [],
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
										id: member.id,
										data,
									});

									queryClient.setQueryData<Account | null>(
										useAccountQuery.getQueryKey(member.id),
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
										description: 'Member has been updated',
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
									<Dialog.Title>Edit member</Dialog.Title>
									<Dialog.Description>Fill out the form to edit member</Dialog.Description>
								</div>
								<Dialog.CloseTrigger />
							</Dialog.Header>
							<Dialog.Body className="space-y-3">
								<Controller
									control={form.control}
									name="name"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Name</Field.Label>
											<TextField
												value={ctx.field.value}
												onChange={(v) => ctx.field.onChange(v)}
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
												onChange={(v) => ctx.field.onChange(v)}
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
												onChange={(v) => ctx.field.onChange(v)}
												placeholder="Enter password"
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

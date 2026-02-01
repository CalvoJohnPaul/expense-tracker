import {Portal} from '@ark-ui/react';
import {type Account, UpdateAccountDataInputDefinition} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {invariant} from 'es-toolkit';
import {UserPenIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {Menu} from '~/components/ui/Menu';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useCurrentAccountQuery} from '~/hooks/useCurrentAccountQuery';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useUpdateCurrentAccountMutation} from '~/hooks/useUpdateCurrentAccountMutation';

export function EditProfile() {
	const query = useCurrentAccountQuery();
	const mutation = useUpdateCurrentAccountMutation();

	const form = useForm({
		resolver: zodResolver(
			UpdateAccountDataInputDefinition.omit({
				password: true,
				permissions: true,
			}),
		),
		defaultValues: {
			name: '',
			email: '',
			avatar: null,
		},
	});

	const disclosure = useDisclosure({
		onChange(open) {
			if (open) {
				form.reset({
					name: query.data?.name ?? '',
					email: query.data?.email ?? '',
					avatar: query.data?.avatar ?? null,
				});
			}
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
				value="settings"
				onSelect={() => {
					disclosure.setOpen(true);
				}}
			>
				<UserPenIcon />
				Settings
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
									const updated = await mutation.mutateAsync(data);

									queryClient.setQueryData<Account>(useCurrentAccountQuery.getQueryKey(), updated);
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
										<UserPenIcon />
									</FeaturedIcon.Icon>
								</FeaturedIcon.Root>
								<div>
									<Dialog.Title>Edit profile</Dialog.Title>
									<Dialog.Description>Fill out the form to edit your profile</Dialog.Description>
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

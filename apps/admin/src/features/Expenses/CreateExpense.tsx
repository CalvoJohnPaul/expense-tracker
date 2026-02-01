import {Portal} from '@ark-ui/react';
import {
	CreateExpenseInputDefinition,
	type Expense,
	ExpenseCategoryDefinition,
} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {PlusIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import {useTimeout} from 'usehooks-ts';
import {DateField} from '~/components/forms/DateField';
import {NumberField} from '~/components/forms/NumberField';
import {SelectField} from '~/components/forms/SelectField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {IconButton} from '~/components/ui/IconButton';
import {Tooltip} from '~/components/ui/Tooltip';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useCreateExpenseMutation} from '~/hooks/useCreateExpenseMutation';
import {useCurrentLocationQuery} from '~/hooks/useCurrentLocationQuery';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useExpenseAggregateQuery} from '~/hooks/useExpenseAggregateQuery';
import {useExpenseQuery} from '~/hooks/useExpenseQuery';
import {useExpensesQuery} from '~/hooks/useExpensesQuery';

export function CreateExpense() {
	const mutation = useCreateExpenseMutation();
	const disclosure = useDisclosure();

	const form = useForm({
		resolver: zodResolver(CreateExpenseInputDefinition),
		defaultValues: {
			amount: 100,
			location: '',
			category: 'OTHERS',
			description: '',
			transactionDate: new Date(),
		},
	});

	const currentLocationQuery = useCurrentLocationQuery();

	useTimeout(
		() => {
			form.reset({
				...form.getValues(),
				location: currentLocationQuery.data ?? '',
			});
		},
		currentLocationQuery.data ? 0 : null,
	);

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
									const expense = await mutation.mutateAsync(data);

									queryClient.setQueryData<Expense | null>(
										useExpenseQuery.getQueryKey(expense.id),
										expense,
									);

									queryClient.invalidateQueries({
										queryKey: useExpensesQuery.getQueryKey(),
										type: 'all',
										exact: false,
										refetchType: 'active',
									});

									queryClient.invalidateQueries({
										queryKey: useExpenseAggregateQuery.getQueryKey(),
										type: 'all',
										exact: false,
										refetchType: 'active',
									});

									disclosure.setOpen(false);
									toaster.success({
										description: 'Record has been created',
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
									<Dialog.Title>Create expense</Dialog.Title>
									<Dialog.Description>Fill out the form to create expense</Dialog.Description>
								</div>
								<Dialog.CloseTrigger />
							</Dialog.Header>
							<Dialog.Body className="space-y-3">
								<Controller
									control={form.control}
									name="category"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Category</Field.Label>
											<SelectField
												value={ctx.field.value}
												onChange={ctx.field.onChange}
												options={ExpenseCategoryDefinition.options.map((value) => ({
													value,
													label: value.replace(/_/g, ' '),
												}))}
												placeholder="Select category"
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="location"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Location</Field.Label>
											<TextField
												placeholder="Enter location"
												value={ctx.field.value ?? ''}
												onChange={(v) => ctx.field.onChange(v ?? '')}
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="amount"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Amount</Field.Label>
											<NumberField
												placeholder="Enter amount"
												value={ctx.field.value}
												onChange={ctx.field.onChange}
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
								<Controller
									control={form.control}
									name="transactionDate"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>Transaction date</Field.Label>
											<DateField
												placeholder="Select transaction date"
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
								>
									Cancel
								</Button>
								<Button>Create</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

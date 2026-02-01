import {Portal} from '@ark-ui/react';
import type {Expense} from '@expense-tracker/defs';
import {Trash2Icon} from 'lucide-react';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Menu} from '~/components/ui/Menu';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useDeleteExpenseMutation} from '~/hooks/useDeleteExpenseMutation';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useExpenseAggregateQuery} from '~/hooks/useExpenseAggregateQuery';
import {useExpenseQuery} from '~/hooks/useExpenseQuery';
import {useExpensesQuery} from '~/hooks/useExpensesQuery';
import {useExpenseContext} from './ExpensesContext';

export function DeleteExpense() {
	const expense = useExpenseContext();
	const mutation = useDeleteExpenseMutation();
	const disclosure = useDisclosure();

	return (
		<Dialog.Root
			role="alertdialog"
			open={disclosure.open}
			onOpenChange={(details) => {
				disclosure.setOpen(details.open);
			}}
		>
			<Menu.Item
				value="delete"
				onSelect={() => {
					disclosure.setOpen(true);
				}}
			>
				<Trash2Icon /> Delete
			</Menu.Item>

			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-120 max-w-120">
						<Dialog.Header>
							<FeaturedIcon.Root accent="danger">
								<FeaturedIcon.Icon>
									<Trash2Icon />
								</FeaturedIcon.Icon>
							</FeaturedIcon.Root>
							<div>
								<Dialog.Title>Delete expense</Dialog.Title>
								<Dialog.Description>
									Are you sure you want to delete this item? This action is irreversible.
								</Dialog.Description>
							</div>
							<Dialog.CloseTrigger />
						</Dialog.Header>
						<Dialog.Footer>
							<Button
								variant="outline"
								onClick={() => {
									disclosure.setOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button
								accent="danger"
								onClick={async () => {
									try {
										await mutation.mutateAsync(expense.id);

										queryClient.setQueryData<Expense | null>(
											useExpenseQuery.getQueryKey(expense.id),
											null,
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
											description: 'Record has been deleted',
										});
									} catch (error) {
										toaster.error({
											description: error instanceof Error ? error.message : 'Something went wrong.',
										});
									}
								}}
								disabled={mutation.isPending}
							>
								Delete
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

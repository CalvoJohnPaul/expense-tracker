import {Portal} from '@ark-ui/react';
import type {Expense} from '@expense-tracker/defs';
import {Trash2Icon} from 'lucide-react';
import {useBoolean} from 'usehooks-ts';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {IconButton} from '~/components/ui/IconButton';
import {Tooltip} from '~/components/ui/Tooltip';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useDeleteExpenseMutation} from '~/hooks/useDeleteExpenseMutation';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useExpenseAggregateQuery} from '~/hooks/useExpenseAggregateQuery';
import {useExpenseQuery} from '~/hooks/useExpenseQuery';
import {useExpensesQuery} from '~/hooks/useExpensesQuery';

interface BulkDeleteExpenseProps {
	ids: number[];
	onDeleted?: () => void | Promise<void>;
}

export function BulkDeleteExpense(props: BulkDeleteExpenseProps) {
	const disclosure = useDisclosure();
	const mutation = useDeleteExpenseMutation();
	const pending = useBoolean();

	return (
		<Dialog.Root
			role="alertdialog"
			open={disclosure.open}
			onOpenChange={(details) => {
				disclosure.setOpen(details.open);
			}}
		>
			<Tooltip.Root positioning={{placement: 'bottom'}}>
				<Tooltip.Trigger asChild>
					<IconButton
						onClick={() => {
							disclosure.setOpen(true);
						}}
					>
						<Trash2Icon />
					</IconButton>
				</Tooltip.Trigger>
				<Tooltip.Positioner>
					<Tooltip.Content>
						<Tooltip.Arrow>
							<Tooltip.ArrowTip />
						</Tooltip.Arrow>
						Delete
					</Tooltip.Content>
				</Tooltip.Positioner>
			</Tooltip.Root>

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
								<Dialog.Title>Delete expenses</Dialog.Title>
								<Dialog.Description>
									You are about to delete{' '}
									<span className="font-semibold text-neutral-300">{props.ids.length}</span>{' '}
									{props.ids.length > 1 ? 'items' : 'item'}? This action is irreversible.
								</Dialog.Description>
							</div>
							<Dialog.CloseTrigger />
						</Dialog.Header>
						<Dialog.Footer>
							<Button
								variant="outline"
								disabled={pending.value}
								onClick={() => {
									disclosure.setOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button
								accent="danger"
								disabled={pending.value}
								onClick={async () => {
									try {
										pending.setTrue();

										const promises = props.ids.map((id) => mutation.mutateAsync(id));

										await Promise.allSettled(promises);

										props.ids.forEach((id) => {
											queryClient.setQueryData<Expense | null>(
												useExpenseQuery.getQueryKey(id),
												null,
											);
										});

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

										await props.onDeleted?.();

										disclosure.setOpen(false);
										toaster.success({
											description:
												props.ids.length > 1
													? 'Records have been deleted'
													: 'Record has been deleted',
										});
									} catch (error) {
										toaster.error({
											description: error instanceof Error ? error.message : 'Something went wrong.',
										});
									} finally {
										pending.setFalse();
									}
								}}
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

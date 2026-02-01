import {Portal} from '@ark-ui/react';
import type {Account} from '@expense-tracker/defs';
import {Trash2Icon} from 'lucide-react';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Menu} from '~/components/ui/Menu';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useAccountAggregateQuery} from '~/hooks/useAccountAggregateQuery';
import {useAccountQuery} from '~/hooks/useAccountQuery';
import {useAccountsQuery} from '~/hooks/useAccountsQuery';
import {useDeleteExpenseMutation} from '~/hooks/useDeleteExpenseMutation';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useMemberContext} from './MembersContext';

export function DeleteMember() {
	const member = useMemberContext();
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
								<Dialog.Title>Delete member</Dialog.Title>
								<Dialog.Description>
									Are you sure you want to delete{' '}
									<span className="font-semibold text-neutral-300">{member.name}</span>? This action
									is irreversible.
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
										await mutation.mutateAsync(member.id);

										queryClient.setQueryData<Account | null>(
											useAccountQuery.getQueryKey(member.id),
											null,
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
											description: 'Member has been deleted',
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

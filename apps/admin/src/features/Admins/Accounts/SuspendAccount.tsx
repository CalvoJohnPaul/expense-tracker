import {Portal} from '@ark-ui/react';
import type {Account} from '@expense-tracker/defs';
import {CircleSlashIcon} from 'lucide-react';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Menu} from '~/components/ui/Menu';
import {queryClient} from '~/config/queryClient';
import {toaster} from '~/config/toaster';
import {useAccountAggregateQuery} from '~/hooks/useAccountAggregateQuery';
import {useAccountQuery} from '~/hooks/useAccountQuery';
import {useAccountsQuery} from '~/hooks/useAccountsQuery';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useSuspendAccountMutation} from '~/hooks/useSuspendAccountMutation';
import {useAccountContext} from './AccountsContext';

export function SuspendAccount() {
	const account = useAccountContext();
	const mutation = useSuspendAccountMutation();
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
				value="suspend"
				onSelect={() => {
					disclosure.setOpen(true);
				}}
				hidden={account.status === 'SUSPENDED'}
			>
				<CircleSlashIcon /> Suspend
			</Menu.Item>

			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-120 max-w-120">
						<Dialog.Header>
							<FeaturedIcon.Root accent="warning">
								<FeaturedIcon.Icon>
									<CircleSlashIcon />
								</FeaturedIcon.Icon>
							</FeaturedIcon.Root>
							<div>
								<Dialog.Title>Suspend admin</Dialog.Title>
								<Dialog.Description>
									Are you sure you want to suspend{' '}
									<span className="font-semibold text-neutral-300">{account.name}</span>? This
									action is irreversible.
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
								accent="warning"
								onClick={async () => {
									try {
										const updated = await mutation.mutateAsync(account.id);

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
											description: 'Admin has been suspended',
										});
									} catch (error) {
										toaster.error({
											description: error instanceof Error ? error.message : 'Something went wrong.',
										});
									}
								}}
								disabled={mutation.isPending}
							>
								Suspend
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

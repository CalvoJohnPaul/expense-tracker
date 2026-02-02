import {Portal} from '@ark-ui/react';
import {noop} from 'es-toolkit';
import {SquareArrowOutUpRightIcon, UserIcon} from 'lucide-react';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useAccountContext} from './AccountsContext';
import {PermissionField} from './PermissionField';

export function ViewAccount() {
	const account = useAccountContext();
	const disclosure = useDisclosure();

	return (
		<Dialog.Root
			open={disclosure.open}
			onOpenChange={(details) => {
				disclosure.setOpen(details.open);
			}}
		>
			<Dialog.Trigger className="icon:size-4 text-neutral-500 hover:text-blue-400">
				<SquareArrowOutUpRightIcon />
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-120 max-w-120">
						<Dialog.Header>
							<FeaturedIcon.Root accent="info">
								<FeaturedIcon.Icon>
									<UserIcon />
								</FeaturedIcon.Icon>
							</FeaturedIcon.Root>
							<div>
								<Dialog.Title>{account.name}</Dialog.Title>
								<Dialog.Description>Admin details</Dialog.Description>
							</div>
							<Dialog.CloseTrigger />
						</Dialog.Header>
						<Dialog.Body className="space-y-3">
							<Field.Root readOnly>
								<Field.Label>Name</Field.Label>
								<TextField value={account.name} onChange={noop} placeholder="Enter name" />
							</Field.Root>
							<Field.Root readOnly>
								<Field.Label>Email</Field.Label>
								<TextField
									type="email"
									value={account.email}
									onChange={noop}
									placeholder="Enter email"
								/>
							</Field.Root>
							<Field.Root readOnly>
								<Field.Label>Permissions</Field.Label>
								<PermissionField value={account.permissions} onChange={noop} />
							</Field.Root>
						</Dialog.Body>
						<Dialog.Footer>
							<Button
								variant="outline"
								onClick={() => {
									disclosure.setOpen(false);
								}}
							>
								Close
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

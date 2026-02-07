import {Portal} from '@ark-ui/react';
import {noop} from 'es-toolkit';
import {SquareArrowOutUpRightIcon, UserIcon} from 'lucide-react';
import {AvatarField} from '~/components/forms/AvatarField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useMemberContext} from './MembersContext';

export function ViewMember() {
	const member = useMemberContext();
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
								<Dialog.Title>{member.name}</Dialog.Title>
								<Dialog.Description>Member details</Dialog.Description>
							</div>
							<Dialog.CloseTrigger />
						</Dialog.Header>
						<Dialog.Body className="space-y-3">
							<Field.Root>
								<Field.Label>Avatar</Field.Label>
								<AvatarField value={member.avatar} onChange={noop} readOnly />
							</Field.Root>
							<Field.Root>
								<Field.Label>Name</Field.Label>
								<TextField value={member.name} onChange={noop} readOnly placeholder="Enter name" />
							</Field.Root>
							<Field.Root>
								<Field.Label>Email</Field.Label>
								<TextField
									type="email"
									value={member.email}
									onChange={noop}
									readOnly
									placeholder="Enter email"
								/>
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

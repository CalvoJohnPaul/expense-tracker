import {delay} from 'es-toolkit';
import {LogOutIcon} from 'lucide-react';
import {useNavigate} from 'react-router';
import {Avatar} from '~/components/ui/Avatar';
import {Menu} from '~/components/ui/Menu';
import {queryClient} from '~/config/queryClient';
import {useCurrentAccountQuery} from '~/hooks/useCurrentAccountQuery';
import {useDestroySessionMutation} from '~/hooks/useDestroySessionMutation';
import {ChangePassword} from './ChangePassword';
import {EditProfile} from './EditProfile';

export function Navbar() {
	const navigate = useNavigate();

	const accountQuery = useCurrentAccountQuery();
	const destroySessionMutation = useDestroySessionMutation();

	return (
		<header className="sticky top-0 z-sticky flex h-16 items-center border-b bg-neutral-900 pr-8 pl-3">
			<div className="grow" />
			<div className="flex items-center gap-3">
				<div>
					<p className="text-right font-medium text-xs leading-tight">{accountQuery.data?.name}</p>
					<p className="text-right text-neutral-300 text-xs leading-tight">
						{accountQuery.data?.email}
					</p>
				</div>
				<Menu.Root>
					<Menu.Trigger>
						<Avatar.Root>
							<Avatar.Image src={accountQuery.data?.avatar ?? undefined} />
							<Avatar.Fallback />
						</Avatar.Root>
					</Menu.Trigger>
					<Menu.Positioner>
						<Menu.Content>
							<EditProfile />
							<ChangePassword />
							<Menu.Separator />
							<Menu.Item
								value="logout"
								onClick={async () => {
									await destroySessionMutation.mutateAsync();
									queryClient.setQueryData(useCurrentAccountQuery.getQueryKey(), null);
									await delay(1);
									await navigate('/');
									queryClient.invalidateQueries({
										queryKey: [],
										exact: false,
										refetchType: 'active',
									});
								}}
								disabled={destroySessionMutation.isPending}
							>
								<LogOutIcon />
								Sign out
							</Menu.Item>
						</Menu.Content>
					</Menu.Positioner>
				</Menu.Root>
			</div>
		</header>
	);
}

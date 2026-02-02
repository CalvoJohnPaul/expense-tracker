import {useUrl} from 'crossroad';
import {delay} from 'es-toolkit';
import {CoinsIcon, LogOutIcon, TrendingUpIcon, UserIcon, UserLockIcon} from 'lucide-react';
import {Tooltip} from '~/components/ui/Tooltip';
import {queryClient} from '~/config/queryClient';
import {useCurrentAccountQuery} from '~/hooks/useCurrentAccountQuery';
import {useDestroySessionMutation} from '~/hooks/useDestroySessionMutation';
import {tw} from '~/utils/tw';
import {LogoIcon} from '../../components/icons/LogoIcon';

export function Sidebar() {
	const [url, setUrl] = useUrl();

	const accountQuery = useCurrentAccountQuery();
	const destroySessionMutation = useDestroySessionMutation();

	const items = [
		{
			icon: <TrendingUpIcon />,
			path: '/',
			label: 'Dashboard',
			enabled: accountQuery.data?.type === 'MEMBER',
		},
		{
			icon: <CoinsIcon />,
			path: '/expenses',
			label: 'Expenses',
			enabled: accountQuery.data?.type === 'MEMBER',
		},
		{
			icon: <UserIcon />,
			path: '/',
			label: 'Members',
			enabled: accountQuery.data?.type === 'ADMIN',
		},
		{
			icon: <UserLockIcon />,
			path: '/admins',
			label: 'Admins',
			enabled: accountQuery.data?.type === 'ADMIN',
		},
	];

	return (
		<div className="sticky top-0 z-sticky h-dvh w-18 border-r py-3">
			<LogoIcon className="mx-auto h-9 w-auto" />
			<nav className="mt-8 px-3">
				<ul className="space-y-1">
					{items.map((item) => {
						if (!item.enabled) return null;

						return (
							<li key={item.path} className="block">
								<Tooltip.Root positioning={{placement: 'right'}}>
									<Tooltip.Trigger asChild>
										<a
											href={item.path}
											className={itemStyle}
											data-active={item.path === url.path || undefined}
										>
											{item.icon}
										</a>
									</Tooltip.Trigger>
									<Tooltip.Positioner>
										<Tooltip.Content>
											<Tooltip.Arrow>
												<Tooltip.ArrowTip />
											</Tooltip.Arrow>
											{item.label}
										</Tooltip.Content>
									</Tooltip.Positioner>
								</Tooltip.Root>
							</li>
						);
					})}

					<li className="block">
						<Tooltip.Root positioning={{placement: 'right'}}>
							<Tooltip.Trigger
								className={itemStyle}
								onClick={async () => {
									await destroySessionMutation.mutateAsync();
									queryClient.setQueryData(useCurrentAccountQuery.getQueryKey(), null);
									await delay(1);
									setUrl('/');
									queryClient.invalidateQueries({
										queryKey: [],
										exact: false,
										refetchType: 'active',
									});
								}}
								disabled={destroySessionMutation.isPending}
							>
								<LogOutIcon />
							</Tooltip.Trigger>
							<Tooltip.Positioner>
								<Tooltip.Content>
									<Tooltip.Arrow>
										<Tooltip.ArrowTip />
									</Tooltip.Arrow>
									Sign out
								</Tooltip.Content>
							</Tooltip.Positioner>
						</Tooltip.Root>
					</li>
				</ul>
			</nav>
		</div>
	);
}

const itemStyle = tw`flex aspect-square w-full items-center justify-center rounded-md text-neutral-200 ui-active:bg-blue-900/25 ui-active:text-blue-300 icon:size-6 disabled:opacity-50`;

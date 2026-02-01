import {Presence} from '@ark-ui/react';
import * as z from 'zod';
import {Tabs} from '~/components/ui/Tabs';
import {useAccessValidator} from '~/hooks/useAccessValidator';
import {Accounts} from './Accounts/Accounts';
import {BulkDeleteAccount} from './Accounts/BulkDeleteAccount';
import {BulkSuspendAccount} from './Accounts/BulkSuspendAccount';
import {BulkUnsuspendAccount} from './Accounts/BulkUnsuspendAccount';
import {CreateAccount} from './Accounts/CreateAccount';
import {Activities} from './Activities/Activities';
import {ExportActivities} from './Activities/ExportActivities';
import {AdminsProvider, TabDefinition, useAdmins} from './AdminsContext';

export function Admins() {
	const accessValidator = useAccessValidator();
	const context = useAdmins();

	return (
		<AdminsProvider value={context}>
			<div>
				{context.tab === 'accounts' ? (
					<div className="mb-8">
						<h1 className="font-bold text-3xl">Admins</h1>
						<p className="text-neutral-300">Manage admin accounts</p>
					</div>
				) : (
					<div className="mb-8">
						<h1 className="font-bold text-3xl">Admin activities</h1>
						<p className="text-neutral-300">Monitor admin activities</p>
					</div>
				)}

				<Tabs.Root
					value={context.tab}
					onValueChange={(details) => {
						context.setAccountState(null);
						context.setActivityState(null);
						context.setTab(TabDefinition.parse(details.value));
					}}
				>
					<div className="flex gap-3">
						<Tabs.List className="mb-8 w-fit">
							<Tabs.Trigger value="accounts">Accounts</Tabs.Trigger>
							<Tabs.Trigger value="activities">Activities</Tabs.Trigger>
							<Tabs.Indicator />
						</Tabs.List>

						<div className="grow" />

						{context.tab === 'activities' && <ExportActivities />}
						{context.tab === 'accounts' && (
							<>
								{accessValidator.permission.hasOneOf([
									'SUSPEND_ADMIN_ACCOUNT',
									'UNSUSPEND_ADMIN_ACCOUNT',
									'DELETE_ADMIN_ACCOUNT',
								]) && (
									<Presence
										present={context.selectedAccounts.length > 0}
										className="flex ui-closed:animate-fade-out ui-open:animate-fade-in gap-3"
									>
										{accessValidator.permission.has('SUSPEND_ADMIN_ACCOUNT') && (
											<BulkSuspendAccount
												ids={z.array(z.coerce.number()).parse(context.selectedAccounts)}
												onSuspended={() => context.setSelectedAccounts([])}
											/>
										)}
										{accessValidator.permission.has('UNSUSPEND_ADMIN_ACCOUNT') && (
											<BulkUnsuspendAccount
												ids={z.array(z.coerce.number()).parse(context.selectedAccounts)}
												onUnsuspended={() => context.setSelectedAccounts([])}
											/>
										)}
										{accessValidator.permission.has('DELETE_ADMIN_ACCOUNT') && (
											<BulkDeleteAccount
												ids={z.array(z.coerce.number()).parse(context.selectedAccounts)}
												onDeleted={() => context.setSelectedAccounts([])}
											/>
										)}
									</Presence>
								)}

								{accessValidator.permission.has('CREATE_ADMIN_ACCOUNT') && <CreateAccount />}
							</>
						)}
					</div>

					<Tabs.Content value="accounts">
						<Accounts />
					</Tabs.Content>
					<Tabs.Content value="activities">
						<Activities />
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</AdminsProvider>
	);
}

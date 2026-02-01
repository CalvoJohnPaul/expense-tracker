import type {PropsWithChildren} from 'react';
import {LogoIcon} from '~/components/icons/LogoIcon';
import {Protected} from '~/components/Protected';
import {Button} from '~/components/ui/Button';
import {Tabs} from '~/components/ui/Tabs';
import {Login} from './Login';
import {Navbar} from './Navbar';
import {Register} from './Register';
import {Sidebar} from './Sidebar';

export function RootLayout({children}: PropsWithChildren) {
	return (
		<Protected
			loader={<SplashScreen />}
			fallback={(reason) => {
				if (reason === 'NOT_ENOUGH_PERMISSION') {
					return (
						<main className="flex min-h-dvh flex-col items-center justify-center px-8 py-16">
							<LogoIcon className="mx-auto mb-8 h-14 w-auto" />
							<h1 className="font-bold text-3xl">Access denied</h1>
							<p className="mt-1 text-neutral-300">
								You don't have enough permission to access this page
							</p>
							<Button variant="outline" className="mt-6 px-8">
								Sign Out
							</Button>
						</main>
					);
				}

				return (
					<main className="mx-auto max-w-md px-8 py-16">
						<LogoIcon className="mx-auto mb-12 h-14 w-auto" />

						<Tabs.Root defaultValue="login">
							<Tabs.Context>
								{(api) => (
									<h1 className="mb-12 text-center font-bold text-4xl">
										{api.value === 'login' ? 'Sign In' : 'Sign Up'}
									</h1>
								)}
							</Tabs.Context>
							<Tabs.List className="mb-8">
								<Tabs.Trigger value="login">Sign In</Tabs.Trigger>
								<Tabs.Trigger value="register">Sign Up</Tabs.Trigger>
								<Tabs.Indicator />
							</Tabs.List>
							<Tabs.Content value="login">
								<Login />
							</Tabs.Content>
							<Tabs.Content value="register">
								<Register />
							</Tabs.Content>
						</Tabs.Root>
					</main>
				);
			}}
		>
			<div className="flex items-start">
				<Sidebar />
				<div className="w-[calc(100%-4.5rem)]">
					<Navbar />
					<main className="p-8">{children}</main>
				</div>
			</div>
		</Protected>
	);
}

function SplashScreen() {
	return (
		<div className="flex min-h-dvh animate-pulse items-center">
			<LogoIcon className="mx-auto h-auto w-24" />
		</div>
	);
}

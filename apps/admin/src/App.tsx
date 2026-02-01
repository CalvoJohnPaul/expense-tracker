import {Toaster} from '@ark-ui/react';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import Router, {Route, Switch} from 'crossroad';
import {FrownIcon, InfoIcon, PartyPopperIcon, XIcon} from 'lucide-react';
import {debounce} from 'nuqs';
import {NuqsAdapter} from 'nuqs/adapters/react';
import './app.css';
import {Protected} from './components/Protected';
import {FeaturedIcon} from './components/ui/FeaturedIcon';
import {Toast} from './components/ui/Toast';
import {queryClient} from './config/queryClient';
import {toaster} from './config/toaster';
import {Admins} from './features/Admins';
import {Dashboard} from './features/Dashboard';
import {Expenses} from './features/Expenses';
import {MemberAccounts} from './features/Members/Members';
import {RootLayout} from './features/RootLayout';

export function App() {
	return (
		<>
			<NuqsAdapter
				defaultOptions={{
					scroll: true,
					clearOnDefault: true,
					limitUrlUpdates: debounce(250),
				}}
			>
				<QueryClientProvider client={queryClient}>
					<Router>
						<Switch>
							<RootLayout>
								<Protected type="MEMBER">
									<Route path="/" component={Dashboard} />
									<Route path="/expenses" component={Expenses} />
								</Protected>

								<Protected type="ADMIN">
									<Route path="/" component={MemberAccounts} />
									<Route path="/admins" component={Admins} />
								</Protected>
							</RootLayout>
						</Switch>
					</Router>
					<ReactQueryDevtools />
				</QueryClientProvider>
			</NuqsAdapter>

			<Toaster toaster={toaster}>
				{(toast) => (
					<Toast.Root>
						<FeaturedIcon.Root
							size="sm"
							accent={
								toast.type === 'error' ? 'danger' : toast.type === 'success' ? 'primary' : 'info'
							}
						>
							<FeaturedIcon.Icon>
								{toast.type === 'error' ? (
									<FrownIcon />
								) : toast.type === 'success' ? (
									<PartyPopperIcon />
								) : (
									<InfoIcon />
								)}
							</FeaturedIcon.Icon>
						</FeaturedIcon.Root>
						<div>
							<Toast.Title>
								{toast.title
									? toast.title
									: toast.type === 'error'
										? 'Error'
										: toast.type === 'success'
											? 'Success'
											: null}
							</Toast.Title>
							<Toast.Description>
								{toast.description
									? toast.description
									: toast.type === 'error'
										? 'Something went wrong'
										: toast.type === 'success'
											? 'Request has been processed'
											: null}
							</Toast.Description>
						</div>
						<Toast.CloseTrigger>
							<XIcon />
						</Toast.CloseTrigger>
					</Toast.Root>
				)}
			</Toaster>
		</>
	);
}

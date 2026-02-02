import {Toaster} from '@ark-ui/react';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {FrownIcon, InfoIcon, PartyPopperIcon, XIcon} from 'lucide-react';
import {debounce} from 'nuqs';
import {NuqsAdapter} from 'nuqs/adapters/react';
import {BrowserRouter, Link, Route, Routes} from 'react-router';
import './app.css';
import {Button} from './components/ui/Button';
import {FeaturedIcon} from './components/ui/FeaturedIcon';
import {Toast} from './components/ui/Toast';
import {queryClient} from './config/queryClient';
import {toaster} from './config/toaster';
import {Admins} from './features/Admins';
import {Dashboard} from './features/Dashboard';
import {Expenses} from './features/Expenses';
import {Members} from './features/Members/Members';
import {RootLayout} from './features/RootLayout';
import {useCurrentAccountQuery} from './hooks/useCurrentAccountQuery';

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
					<BrowserRouter>
						<RootLayout>
							<Routes>
								<Route path="/" element={<Index />} />
								<Route path="/expenses" element={<Expenses />} />
								<Route path="/admins" element={<Admins />} />
								<Route path="*" element={<_404 />} />
							</Routes>
						</RootLayout>
					</BrowserRouter>
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

function Index() {
	const query = useCurrentAccountQuery();
	if (query.data == null) return null;
	if (query.data.type === 'ADMIN') return <Members />;
	return <Dashboard />;
}

function _404() {
	return (
		<div className="flex flex-col items-center py-32">
			<FeaturedIcon.Root accent="danger">
				<FeaturedIcon.Icon>
					<FrownIcon />
				</FeaturedIcon.Icon>
			</FeaturedIcon.Root>
			<h1 className="mt-5 font-bold text-2xl">Page not found</h1>
			<p className="text-neutral-300">
				The page you’re trying to access doesn’t exist or may have been removed.
			</p>
			<Button type="button" variant="outline" className="mt-5" asChild>
				<Link to="/">Get me out</Link>
			</Button>
		</div>
	);
}

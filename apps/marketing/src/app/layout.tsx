import type {Metadata} from 'next';
import {Fira_Code, Inter, Open_Sans} from 'next/font/google';
import type {PropsWithChildren} from 'react';
import {twJoin} from 'tailwind-merge';
import {Footer} from './Footer';
import './globals.css';
import {Navbar} from './Navbar';
import {Providers} from './Providers';

export const metadata: Metadata = {
	title: {
		default: 'Expense Tracker',
		template: 'Expense Tracker | %s',
	},
	metadataBase: new URL('https://calvojp-expense-tracker.vercel.app'),
	openGraph: {
		title: 'Spend wisely!',
		description:
			'Stay in control of your finances - effortlessly monitor daily expenses and gain valuable spending insights.',
	},
};

const body = Inter({
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	subsets: ['latin'],
	preload: true,
	variable: '--font-body',
});

const heading = Open_Sans({
	weight: ['400', '500', '600', '700', '800'],
	display: 'swap',
	subsets: ['latin'],
	preload: true,
	variable: '--font-heading',
});

const mono = Fira_Code({
	weight: ['400'],
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-mono',
});

export default async function RootLayout({children}: PropsWithChildren) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={twJoin(body.variable, heading.variable, mono.variable, 'scheme-dark')}
		>
			<body className="min-h-dvh bg-neutral-900 font-body text-neutral-100">
				<Providers>
					<Navbar />
					<main>{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}

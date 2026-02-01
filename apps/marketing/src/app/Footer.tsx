import {ark} from '@ark-ui/react';
import Link from 'next/link';
import {Subscribe} from './Subscribe';

export function Footer() {
	return (
		<footer className="mt-24 border-t py-16 lg:mt-40 lg:py-20">
			<div className="mx-auto max-w-5xl px-4 lg:px-8">
				<div className="grid gap-16 lg:grid-cols-3 lg:gap-1">
					<div>
						<div className="mb-5">&copy; Expense Tracker {new Date().getFullYear()}</div>

						<Socials />
					</div>
					<div>
						<QuickLinks />
					</div>
					<div>
						<Subscribe />
					</div>
				</div>
			</div>
		</footer>
	);
}

function Socials() {
	const items = [
		{
			name: 'Instagram',
			href: '#',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
					/>
				</svg>
			),
		},
		{
			name: 'Linkedin',
			href: '#',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
					<g
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					>
						<path d="M8 11v5m0-8v.01M12 16v-5m4 5v-3a2 2 0 1 0-4 0" />
						<path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
					</g>
				</svg>
			),
		},
	];

	return (
		<nav>
			<ul className="flex gap-3">
				{items.map((item) => (
					<a
						key={item.name}
						href={item.href}
						rel="noreferrer noopener"
						target="_blank"
						title={item.name}
					>
						<ark.svg asChild className="size-6 text-neutral-300">
							{item.icon}
						</ark.svg>
						<span className="sr-only">{item.name}</span>
					</a>
				))}
			</ul>
		</nav>
	);
}

function QuickLinks() {
	const items = [
		{
			label: 'About',
			path: '/#about',
		},
		{
			label: 'Features',
			path: '/#features',
		},
		{
			label: 'How It Works',
			path: '/#how-it-works',
		},
		{
			label: 'Testimonials',
			path: '/#testimonials',
		},
		{
			label: 'Faqs',
			path: '/#faqs',
		},
		{
			label: 'Contact Us',
			path: '/#contact-us',
		},
	];

	return (
		<>
			<div className="font-heading font-medium uppercase">Quick Links</div>
			<nav className="mt-5">
				<ul>
					{items.map((item) => (
						<li key={item.path}>
							<Link
								href={item.path}
								className="text-neutral-300 underline-offset-2 hover:underline"
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

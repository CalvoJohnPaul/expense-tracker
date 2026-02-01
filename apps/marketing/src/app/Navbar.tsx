import Link from 'next/link';
import {Button} from '~/components/ui/Button';

export function Navbar() {
	return (
		<header className="flex h-18 items-center border-b px-4 py-3 lg:px-8">
			<svg viewBox="0 0 53 44" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
				<path
					d="M23.2997 0L52.0461 28.6301V44H38.6311V34.1553L17.7522 13.3607L13.415 13.3607L13.415 44H0L0 0L23.2997 0ZM38.6311 15.2694V0L52.0461 0V15.2694L38.6311 15.2694Z"
					fill="currentColor"
				/>
			</svg>
			<div className="grow" />
			<div className="flex gap-3">
				<Button asChild variant="subtle">
					<Link
						href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/login`}
						rel="noreferrer noopener"
						target="_blank"
						prefetch={false}
					>
						Login
					</Link>
				</Button>
				<Button asChild>
					<Link
						href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/register`}
						rel="noreferrer noopener"
						target="_blank"
						prefetch={false}
					>
						Get Started
					</Link>
				</Button>
			</div>
		</header>
	);
}

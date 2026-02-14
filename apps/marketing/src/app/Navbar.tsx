import Link from 'next/link';
import {Button} from '~/components/ui/Button';

export function Navbar() {
	return (
		<header className="flex h-18 items-center border-b px-4 py-3 lg:px-8">
			<svg
				width="50"
				height="39"
				viewBox="0 0 50 39"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="h-10 w-auto"
			>
				<path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" className="fill-blue-400" />
				<path
					d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
					className="fill-blue-700"
				/>
			</svg>
			<div className="grow" />
			<div className="flex gap-3">
				<Button asChild variant="subtle">
					<Link
						href={`${process.env.NEXT_PUBLIC_ADMIN_URL}`}
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

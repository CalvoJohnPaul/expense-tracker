import Link from 'next/link';
import {Button} from '~/components/ui/Button';

export function Hero() {
	return (
		<div id="about" className="mx-auto max-w-5xl px-4 pt-24 pb-16 lg:px-8 lg:pt-32 lg:pb-24">
			<h1 className="font-extrabold font-heading text-5xl leading-tight lg:text-6xl">
				Spend wisely!
			</h1>
			<p className="mt-4 max-w-152 text-lg text-neutral-300">
				Stay in control of your finances - effortlessly monitor daily expenses and gain valuable
				spending insights.
			</p>
			<Button asChild size="lg" className="mt-8 w-full lg:w-40">
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
	);
}

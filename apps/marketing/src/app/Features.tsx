import {AtomIcon, BellIcon, CoinsIcon, LightbulbIcon, RocketIcon, WalletIcon} from 'lucide-react';
import type {ReactNode} from 'react';

export function Features() {
	return (
		<div id="features" className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-24">
			<h2 className="text-center font-bold font-heading text-3xl lg:text-4xl">Features</h2>
			<div className="mt-10 grid items-center gap-5 lg:mt-12 lg:grid-cols-3">
				{features.map((feature, index) => (
					<div key={index}>
						<Feature data={feature} />
					</div>
				))}
			</div>
		</div>
	);
}

interface FeatureProps {
	data: {
		icon: ReactNode;
		name: ReactNode;
		description: ReactNode;
	};
}

function Feature(props: FeatureProps) {
	const {icon, name, description} = props.data;

	return (
		<div className="rounded-md border border-neutral-700 bg-neutral-700/10 p-8">
			<div className="w-fit rounded-full bg-blue-800/25 p-3 text-blue-50">{icon}</div>
			<h3 className="mt-4 font-heading font-semibold text-xl">{name}</h3>
			<p className="mt-1 text-neutral-300 text-sm">{description}</p>
		</div>
	);
}

const features: FeatureProps['data'][] = [
	{
		icon: <RocketIcon />,
		name: 'Feature 1',
		description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ut
    sint voluptatibus sit dolorum consequatur eligendi earum`,
	},
	{
		icon: <CoinsIcon />,
		name: 'Feature 2',
		description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ut
    sint voluptatibus sit dolorum consequatur eligendi earum`,
	},
	{
		icon: <LightbulbIcon />,
		name: 'Feature 3',
		description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ut
    sint voluptatibus sit dolorum consequatur eligendi earum`,
	},
	{
		icon: <AtomIcon />,
		name: 'Feature 4',
		description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ut
    sint voluptatibus sit dolorum consequatur eligendi earum`,
	},
	{
		icon: <WalletIcon />,
		name: 'Feature 5',
		description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ut
    sint voluptatibus sit dolorum consequatur eligendi earum`,
	},
	{
		icon: <BellIcon />,
		name: 'Feature 6',
		description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis ut
    sint voluptatibus sit dolorum consequatur eligendi earum`,
	},
];

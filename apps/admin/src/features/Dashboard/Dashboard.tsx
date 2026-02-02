import {protected_} from '~/components/Protected';

export const Dashboard = protected_(
	() => {
		return (
			<div>
				<div className="mb-8 flex items-center gap-3">
					<div>
						<h1 className="font-bold text-3xl">Dashboard</h1>
						<p className="text-neutral-300">Keep an eye on your spending and financial activity.</p>
					</div>
					<div className="grow" />
				</div>
			</div>
		);
	},
	{
		type: 'MEMBER',
	},
);

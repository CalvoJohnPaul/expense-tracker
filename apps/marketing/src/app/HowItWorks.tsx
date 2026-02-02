import {Tabs} from '@ark-ui/react';
import {instructions} from '~/content';

export async function HowItWorks() {
	return (
		<div id="how-it-works" className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-24">
			<h2 className="text-center font-bold font-heading text-4xl">How It Works</h2>

			<Tabs.Root
				orientation="vertical"
				defaultValue={instructions[0].title}
				className="mt-14 hidden gap-8 lg:flex"
			>
				<Tabs.List className="flex shrink-0 flex-col self-start border-l">
					{instructions.map((item, index) => (
						<Tabs.Trigger key={item.title} value={item.title} className="px-4 py-1 text-left">
							<span className="font-mono">{index + 1}.</span>
							<span>{item.title}</span>
						</Tabs.Trigger>
					))}

					<Tabs.Indicator className="-ml-px h-(--height) w-0.5 bg-blue-700" />
				</Tabs.List>

				{instructions.map((item) => (
					<Tabs.Content key={item.title} value={item.title} asChild>
						<RawHtml>{item.content}</RawHtml>
					</Tabs.Content>
				))}
			</Tabs.Root>

			<div className="mt-10 flex flex-col lg:hidden">
				{instructions.map((item, index) => (
					<div key={item.title} className="flex flex-col">
						{index > 0 && <div className="mx-auto h-10 w-px bg-neutral-800" />}

						<div className="mx-auto flex size-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-700/25 font-bold font-mono text-lg">
							{index + 1}
						</div>

						<div className="mx-auto h-10 w-px bg-neutral-800" />

						<div className="py-5 text-center">
							<div className="mb-1 font-heading">{item.title}</div>
							<RawHtml>{item.content}</RawHtml>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function RawHtml({children}: {children: string}) {
	return (
		<div
			className="prose-sm prose-neutral lg:prose-base"
			dangerouslySetInnerHTML={{
				__html: children,
			}}
		/>
	);
}

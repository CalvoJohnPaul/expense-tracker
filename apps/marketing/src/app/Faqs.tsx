import {Accordion} from '@ark-ui/react';
import {faqs} from '~/content';

export async function Faqs() {
	return (
		<div id="faqs" className="mx-auto max-w-2xl px-4 py-16 lg:px-8 lg:py-24">
			<h2 className="text-center font-bold font-heading text-3xl lg:text-4xl">Faqs</h2>
			<Accordion.Root multiple defaultValue={[faqs[0].q]} className="mt-10 lg:mt-12">
				{faqs.map(({q, a}) => {
					return (
						<Accordion.Item key={a} value={a} className="border-b px-2 py-4 first:border-t">
							<Accordion.ItemTrigger className="block w-full text-left font-medium text-lg">
								{q}
								<Accordion.ItemIndicator />
							</Accordion.ItemTrigger>
							<Accordion.ItemContent className="ui-closed:animate-collapse-out ui-open:animate-collapse-in pt-1 text-neutral-400">
								<div
									dangerouslySetInnerHTML={{
										__html: a,
									}}
								/>
							</Accordion.ItemContent>
						</Accordion.Item>
					);
				})}
			</Accordion.Root>
		</div>
	);
}

import {Avatar, Carousel} from '@ark-ui/react';
import {chunk} from 'es-toolkit';
import {ChevronLeftIcon, ChevronRightIcon, QuoteIcon} from 'lucide-react';

import {type Testimonial, testimonials} from '~/content';

export async function Testimonials() {
	const chunks = chunk(testimonials, 2);

	return (
		<div id="testimonials" className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-24">
			<h2 className="text-center font-bold font-heading text-4xl">Testimonials</h2>

			<Carousel.Root slideCount={chunks.length} className="mt-12 hidden lg:block">
				<div className="flex items-center gap-6">
					<Carousel.PrevTrigger className="shrink-0 disabled:opacity-50">
						<ChevronLeftIcon className="size-8" />
					</Carousel.PrevTrigger>
					<Carousel.ItemGroup>
						{chunks.map((list, index) => (
							<Carousel.Item key={index} index={index} asChild>
								<div className="grid gap-6 lg:grid-cols-2">
									{list.map((item, index) => (
										<div key={index}>
											<Item data={item} />
										</div>
									))}
								</div>
							</Carousel.Item>
						))}
					</Carousel.ItemGroup>
					<Carousel.NextTrigger className="shrink-0 disabled:opacity-50">
						<ChevronRightIcon className="size-8" />
					</Carousel.NextTrigger>
				</div>

				<Carousel.IndicatorGroup className="mx-auto mt-8 flex w-fit gap-2">
					{chunks.map((_, index) => (
						<Carousel.Indicator
							key={index}
							index={index}
							className="size-3 rounded-full bg-neutral-600 ui-current:bg-white"
						/>
					))}
				</Carousel.IndicatorGroup>
			</Carousel.Root>
			<div className="mt-10 space-y-5 lg:hidden">
				{testimonials.map((item, index) => (
					<Item key={index} data={item} />
				))}
			</div>
		</div>
	);
}

interface TestimonialProps {
	data: Testimonial;
}

function Item(props: TestimonialProps) {
	const {author, message} = props.data;

	return (
		<div className="flex-col gap-6 rounded-md border border-neutral-700 bg-neutral-700/10 p-8">
			<QuoteIcon className="size-6 text-neutral-600" />

			<div
				className="mt-4 grow"
				dangerouslySetInnerHTML={{
					__html: message,
				}}
			/>

			<div className="mt-4 flex items-center gap-2">
				<Avatar.Root className="size-10 overflow-hidden rounded-full">
					<Avatar.Image src={author.photo} />
				</Avatar.Root>
				<div>
					<div className="font-medium text-sm">{author.name}</div>
					<div className="text-neutral-400 text-xs">
						{author.company.position} at {author.company.name}
					</div>
				</div>
				w
			</div>
		</div>
	);
}

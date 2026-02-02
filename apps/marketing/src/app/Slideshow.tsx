import {Carousel} from '@ark-ui/react';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import Image from 'next/image';

export function Slideshow() {
	return (
		<div className="py-16 lg:py-24">
			<Carousel.Root slideCount={images.length} className="relative">
				<Carousel.ItemGroup>
					{images.map((image, index) => (
						<Carousel.Item key={image} index={index}>
							<Image
								src={image}
								alt=""
								width={1100}
								height={600}
								className="aspect-video w-full object-cover lg:aspect-16/4"
							/>
						</Carousel.Item>
					))}
				</Carousel.ItemGroup>

				<Carousel.Control className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-blue-600/75 px-1.5 py-1">
					<Carousel.PrevTrigger className="disabled:opacity-50">
						<ChevronLeftIcon className="size-5 text-white" />
					</Carousel.PrevTrigger>
					<Carousel.IndicatorGroup className="contents">
						{images.map((image, index) => (
							<Carousel.Indicator
								key={image}
								index={index}
								className="size-2.5 rounded-full bg-blue-700/90 ui-current:bg-white"
							/>
						))}
					</Carousel.IndicatorGroup>
					<Carousel.NextTrigger className="disabled:opacity-50">
						<ChevronRightIcon className="size-5 text-white" />
					</Carousel.NextTrigger>
				</Carousel.Control>
			</Carousel.Root>
		</div>
	);
}

const images = [
	'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
	'https://images.pexels.com/photos/5900178/pexels-photo-5900178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
	'https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

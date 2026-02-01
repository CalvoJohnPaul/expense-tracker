import {ContactUs} from './ContactUs';
import {Faqs} from './Faqs';
import {Features} from './Features';
import {Hero} from './Hero';
import {HowItWorks} from './HowItWorks';
import {Slideshow} from './Slideshow';
import {Testimonials} from './Testimonials';

export default async function Index() {
	return (
		<>
			<Hero />
			<Slideshow />
			<Features />
			<HowItWorks />
			<Testimonials />
			<Faqs />
			<ContactUs />
		</>
	);
}

import {defineCollection, defineConfig, s} from 'velite';

const faqs = defineCollection({
	name: 'Faq',
	pattern: 'faqs/**/*.md',
	schema: s.object({
		q: s.string(),
		a: s.markdown(),
	}),
});

const testimonials = defineCollection({
	name: 'Testimonial',
	pattern: 'testimonials/**/*.md',
	schema: s.object({
		author: s.object({
			name: s.string(),
			photo: s.string().url(),
			company: s.object({
				name: s.string(),
				position: s.string(),
			}),
		}),
		message: s.markdown(),
	}),
});

const instructions = defineCollection({
	name: 'Instructions',
	pattern: 'how-it-works/**/*.md',
	schema: s.object({
		title: s.string(),
		content: s.markdown(),
	}),
});

export default defineConfig({
	collections: {
		faqs,
		testimonials,
		instructions,
	},
	output: {
		clean: true,
		assets: 'public',
		format: 'esm',
	},
});

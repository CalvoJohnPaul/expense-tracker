'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';

export function ContactUs() {
	const form = useForm({
		resolver: zodResolver(
			z.object({
				name: z.string().min(2, 'Name too short').max(25, 'Name too long').trim(),
				email: z.email(),
				message: z.string().min(5, 'Message too short').max(255, 'Message too long').trim(),
			}),
		),
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
	});

	return (
		<div id="contact-us" className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-24">
			<h2 className="text-center font-bold font-heading text-3xl lg:text-4xl">Get in Touch</h2>

			<form
				onSubmit={form.handleSubmit((data) => {
					console.log(data);

					toaster.error({
						title: 'Error',
						description: 'This feature is not yet implemented',
					});

					form.reset();
				})}
				className="mx-auto mt-10 max-w-[24rem] space-y-5 lg:mt-12"
			>
				<Field.Root invalid={!!form.formState.errors.name}>
					<Field.Input placeholder="Name" {...form.register('name')} />
					<Field.ErrorText>{form.formState.errors.name?.message}</Field.ErrorText>
				</Field.Root>
				<Field.Root invalid={!!form.formState.errors.email}>
					<Field.Input placeholder="Email" {...form.register('email')} />
					<Field.ErrorText>{form.formState.errors.email?.message}</Field.ErrorText>
				</Field.Root>
				<Field.Root invalid={!!form.formState.errors.message}>
					<Field.Textarea placeholder="Message" autoresize {...form.register('message')} />
					<Field.ErrorText>{form.formState.errors.message?.message}</Field.ErrorText>
				</Field.Root>
				<Button type="submit" className="w-full">
					Submit
				</Button>
			</form>
		</div>
	);
}

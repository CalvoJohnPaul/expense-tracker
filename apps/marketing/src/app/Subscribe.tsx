'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';

export function Subscribe() {
	const form = useForm({
		resolver: zodResolver(
			z.object({
				email: z.email(),
			}),
		),
		defaultValues: {
			email: '',
		},
	});

	return (
		<>
			<h2 className="font-heading font-medium uppercase">Newsletter</h2>
			<form
				onSubmit={form.handleSubmit((data) => {
					console.log(data);

					toaster.error({
						title: 'Error',
						description: 'This feature is not yet implemented',
						closable: true,
					});

					// form.reset();
				})}
				noValidate
				className="mt-5 flex gap-2 space-y-3 lg:block lg:gap-0 lg:space-y-0"
			>
				<Field.Root invalid={!!form.formState.errors.email}>
					<Field.Input placeholder="Email" {...form.register('email')} />
				</Field.Root>

				<Button type="submit" variant="solid" className="shrink-0 px-4 lg:mt-5 lg:w-full">
					Subscribe
				</Button>
			</form>
		</>
	);
}

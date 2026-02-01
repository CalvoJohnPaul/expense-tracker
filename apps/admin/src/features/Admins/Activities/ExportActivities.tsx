import {Portal} from '@ark-ui/react';
import {zodResolver} from '@hookform/resolvers/zod';
import {DownloadIcon, PlusIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import * as z from 'zod';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {IconButton} from '~/components/ui/IconButton';
import {Tooltip} from '~/components/ui/Tooltip';
import {toaster} from '~/config/toaster';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useExportAdminActivityMutation} from '~/hooks/useExportAdminActivityMutation';
import {useAdminsContext} from '../AdminsContext';

export function ExportActivities() {
	const context = useAdminsContext();
	const exportAdminActivitiesMutation = useExportAdminActivityMutation();

	const disclosure = useDisclosure();
	const form = useForm({
		resolver: zodResolver(
			z.object({
				fileName: z
					.string()
					.trim()
					.min(2, 'Name too short')
					.max(32, 'Name too long')
					.regex(/[a-z0-9-]+/, 'Name must only contain letters, numbers and dash'),
			}),
		),
		defaultValues: {
			fileName: '',
		},
	});

	return (
		<Dialog.Root
			open={disclosure.open}
			onOpenChange={(details) => {
				disclosure.setOpen(details.open);
			}}
			onExitComplete={() => {
				form.reset();
			}}
		>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<IconButton
						disabled={(context.accountAggregateQuery.data?.total ?? 0) <= 0}
						onClick={() => {
							disclosure.setOpen(true);
						}}
					>
						<DownloadIcon />
					</IconButton>
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content>
							<Tooltip.Arrow>
								<Tooltip.ArrowTip />
							</Tooltip.Arrow>
							Export
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Portal>
			</Tooltip.Root>

			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-116 max-w-116" asChild>
						<form
							noValidate
							onSubmit={form.handleSubmit(async ({fileName}) => {
								try {
									const blob = await exportAdminActivitiesMutation.mutateAsync(
										context.activityFilter,
									);

									const url = URL.createObjectURL(blob);
									const link = document.createElement('a');

									link.href = url;
									link.download = `${fileName.toLowerCase()}.xlsx`;
									link.click();

									URL.revokeObjectURL(url);

									disclosure.setOpen(false);
									toaster.success({
										description: 'Records has been exported',
									});
								} catch (error) {
									toaster.error({
										description: error instanceof Error ? error.message : 'Something went wrong.',
									});
								}
							})}
						>
							<Dialog.Header>
								<FeaturedIcon.Root>
									<FeaturedIcon.Icon>
										<PlusIcon />
									</FeaturedIcon.Icon>
								</FeaturedIcon.Root>
								<div>
									<Dialog.Title>Export admin activities</Dialog.Title>
									<Dialog.Description>Fill out the form to start the export</Dialog.Description>
								</div>
								<Dialog.CloseTrigger />
							</Dialog.Header>
							<Dialog.Body className="space-y-3">
								<Controller
									control={form.control}
									name="fileName"
									render={(ctx) => (
										<Field.Root invalid={ctx.fieldState.invalid}>
											<Field.Label>File name</Field.Label>
											<TextField
												placeholder="eg. report"
												value={ctx.field.value ?? ''}
												onChange={(v) => ctx.field.onChange(v ?? '')}
												className="lowercase"
											/>
											<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
										</Field.Root>
									)}
								/>
							</Dialog.Body>
							<Dialog.Footer>
								<Button
									variant="outline"
									onClick={() => {
										disclosure.setOpen(false);
									}}
									disabled={exportAdminActivitiesMutation.isPending}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={exportAdminActivitiesMutation.isPending}>
									Export
								</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

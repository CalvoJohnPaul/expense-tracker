import {Portal} from '@ark-ui/react';
import {ResetPasswordInputDefinition} from '@expense-tracker/defs';
import {zodResolver} from '@hookform/resolvers/zod';
import {LockIcon} from 'lucide-react';
import {Controller, useForm} from 'react-hook-form';
import * as z from 'zod';
import {OtpField} from '~/components/forms/OtpField';
import {PasswordField} from '~/components/forms/PasswordField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';
import {useCooldown} from '~/hooks/useCooldown';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useGenerateOtpMutation} from '~/hooks/useGenerateOtpMutation';
import {useResetPasswordMutation} from '~/hooks/useResetPasswordMutation';

export function ForgotPassword() {
	const cooldown = useCooldown({
		max: 60,
		duration: 1000 * 60,
	});

	const disclosure = useDisclosure();
	const generateOtpMutation = useGenerateOtpMutation();
	const resetPasswordMutation = useResetPasswordMutation();

	const form = useForm({
		resolver: zodResolver(
			ResetPasswordInputDefinition.extend({
				email: z.email(),
				confirmPassword: z.string(),
			}).superRefine((val, ctx) => {
				if (val.newPassword !== val.confirmPassword) {
					ctx.addIssue({
						code: 'custom',
						path: ['confirmPassword'],
						message: "Passwords don't match",
					});
				}
			}),
		),
		defaultValues: {
			email: '',
			otpCode: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	return (
		<Dialog.Root
			open={disclosure.open}
			onOpenChange={(details) => disclosure.setOpen(details.open)}
			onExitComplete={() => {
				form.reset();
				cooldown.stop();
			}}
		>
			<Dialog.Trigger type="button" tabIndex={-1} className="font-semibold text-blue-300 text-sm">
				Forgot password?
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-116 max-w-116">
						<Dialog.Header>
							<FeaturedIcon.Root>
								<FeaturedIcon.Icon>
									<LockIcon />
								</FeaturedIcon.Icon>
							</FeaturedIcon.Root>
							<div>
								<Dialog.Title>Reset password</Dialog.Title>
								<Dialog.Description>Fill out the form to reset your password.</Dialog.Description>
							</div>
							<Dialog.CloseTrigger />
						</Dialog.Header>
						<Dialog.Body className="space-y-3">
							<Controller
								control={form.control}
								name="email"
								render={(ctx) => (
									<Field.Root invalid={ctx.fieldState.invalid} className="w-full">
										<Field.Label>Email</Field.Label>
										<div className="flex gap-2">
											<TextField
												placeholder="Enter your email"
												value={ctx.field.value}
												onChange={ctx.field.onChange}
											/>
											<Button
												variant="outline"
												className="shrink-0 tabular-nums"
												disabled={
													!z.email().safeParse(ctx.field.value).success ||
													cooldown.cooling ||
													generateOtpMutation.isPending ||
													resetPasswordMutation.isPending
												}
												onClick={async () => {
													await generateOtpMutation.mutateAsync(ctx.field.value, {
														onError(error) {
															form.setError('email', {
																message:
																	error.name === 'UnauthorizedError'
																		? 'Account not found'
																		: error.message,
															});
														},
													});

													cooldown.start();
													toaster.success({
														description: `OTP sent to email ${ctx.field.value}`,
													});
												}}
											>
												{cooldown.cooling ? `Resend in ${cooldown.countdown}` : 'Get OTP'}
											</Button>
										</div>
										<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
							<Controller
								control={form.control}
								name="otpCode"
								render={(ctx) => (
									<Field.Root invalid={ctx.fieldState.invalid}>
										<Field.Label>OTP code</Field.Label>
										<OtpField value={ctx.field.value} onChange={ctx.field.onChange} />
										<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
							<Controller
								control={form.control}
								name="newPassword"
								render={(ctx) => (
									<Field.Root invalid={ctx.fieldState.invalid}>
										<Field.Label>New password</Field.Label>
										<PasswordField
											value={ctx.field.value}
											onChange={ctx.field.onChange}
											placeholder="Enter new password"
										/>
										<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
							<Controller
								control={form.control}
								name="confirmPassword"
								render={(ctx) => (
									<Field.Root invalid={ctx.fieldState.invalid}>
										<Field.Label>Confirm new password</Field.Label>
										<PasswordField
											value={ctx.field.value}
											onChange={ctx.field.onChange}
											placeholder="Confirm new password"
										/>
										<Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
						</Dialog.Body>
						<Dialog.Footer>
							<Button
								variant="outline"
								disabled={form.formState.isSubmitting}
								onClick={() => disclosure.setOpen(false)}
							>
								Close
							</Button>
							<Button
								onClick={form.handleSubmit(async (data) => {
									try {
										await resetPasswordMutation.mutateAsync({
											newPassword: data.newPassword,
											otpCode: data.otpCode,
										});

										toaster.success({
											description: 'Password reset successfully',
										});

										disclosure.setOpen(false);
									} catch (error) {
										toaster.error({
											description:
												error instanceof Error
													? error.message
													: 'Something went wrong. Please try again.',
										});
									}
								})}
								disabled={form.formState.isSubmitting}
							>
								Reset
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

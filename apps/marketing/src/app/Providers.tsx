'use client';

import {Toaster} from '@ark-ui/react';
import {BadgeInfoIcon, CircleCheckBig, MessageSquareWarningIcon, XIcon} from 'lucide-react';
import type {PropsWithChildren} from 'react';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Toast} from '~/components/ui/Toast';
import {toaster} from '~/config/toaster';

export function Providers(props: PropsWithChildren) {
	return (
		<>
			{props.children}
			<Toaster toaster={toaster}>
				{(toast) => (
					<Toast.Root>
						<FeaturedIcon.Root
							size="sm"
							accent={
								toast.type === 'error' ? 'danger' : toast.type === 'success' ? 'success' : 'info'
							}
						>
							<FeaturedIcon.Icon>
								{toast.type === 'error' ? (
									<MessageSquareWarningIcon />
								) : toast.type === 'success' ? (
									<CircleCheckBig />
								) : (
									<BadgeInfoIcon />
								)}
							</FeaturedIcon.Icon>
						</FeaturedIcon.Root>
						<div>
							<Toast.Title>{toast.title}</Toast.Title>
							<Toast.Description>{toast.description}</Toast.Description>
						</div>
						<Toast.CloseTrigger>
							<XIcon />
						</Toast.CloseTrigger>
					</Toast.Root>
				)}
			</Toaster>
		</>
	);
}

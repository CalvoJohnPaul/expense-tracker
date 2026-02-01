import {Portal} from '@ark-ui/react';
import {ExpenseCategoryDefinition} from '@expense-tracker/defs';
import {format} from 'date-fns';
import {noop} from 'es-toolkit';
import {CoinsIcon, SquareArrowOutUpRightIcon} from 'lucide-react';
import {DateField} from '~/components/forms/DateField';
import {NumberField} from '~/components/forms/NumberField';
import {SelectField} from '~/components/forms/SelectField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Dialog} from '~/components/ui/Dialog';
import {FeaturedIcon} from '~/components/ui/FeaturedIcon';
import {Field} from '~/components/ui/Field';
import {useDisclosure} from '~/hooks/useDisclosure';
import {useExpenseContext} from './ExpensesContext';

export function ViewExpense() {
	const expense = useExpenseContext();
	const disclosure = useDisclosure();

	return (
		<Dialog.Root
			open={disclosure.open}
			onOpenChange={(details) => {
				disclosure.setOpen(details.open);
			}}
		>
			<Dialog.Trigger className="icon:size-4 text-neutral-500 hover:text-emerald-400">
				<SquareArrowOutUpRightIcon />
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content className="min-w-120 max-w-120">
						<Dialog.Header>
							<FeaturedIcon.Root accent="info">
								<FeaturedIcon.Icon>
									<CoinsIcon />
								</FeaturedIcon.Icon>
							</FeaturedIcon.Root>
							<div>
								<Dialog.Title>{format(expense.transactionDate, 'dd MMM yyyy')}</Dialog.Title>
								<Dialog.Description>Expense details</Dialog.Description>
							</div>
							<Dialog.CloseTrigger />
						</Dialog.Header>
						<Dialog.Body className="space-y-3">
							<Field.Root>
								<Field.Label>Category</Field.Label>
								<SelectField
									value={expense.category}
									onChange={noop}
									options={ExpenseCategoryDefinition.options.map((value) => ({
										value,
										label: value.replace(/_/g, ' '),
									}))}
									readOnly
									placeholder="Select category"
								/>
							</Field.Root>
							<Field.Root>
								<Field.Label>Location</Field.Label>
								<TextField
									value={expense.location ?? ''}
									onChange={noop}
									readOnly
									placeholder="Enter location"
								/>
							</Field.Root>
							<Field.Root>
								<Field.Label>Amount</Field.Label>
								<NumberField
									value={expense.amount}
									onChange={noop}
									readOnly
									placeholder="Enter amount"
								/>
							</Field.Root>
							<Field.Root>
								<Field.Label>Transaction date</Field.Label>
								<DateField
									value={expense.transactionDate}
									onChange={noop}
									readOnly
									placeholder="Select transaction date"
								/>
							</Field.Root>
						</Dialog.Body>
						<Dialog.Footer>
							<Button
								variant="outline"
								onClick={() => {
									disclosure.setOpen(false);
								}}
							>
								Close
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}

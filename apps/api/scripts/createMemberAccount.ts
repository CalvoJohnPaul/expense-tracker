import 'dotenv/config';

import * as p from '@clack/prompts';
import {faker} from '@faker-js/faker';
import {hash} from 'bcrypt';
import * as z from 'zod';
import {prisma} from '../src/config/prisma';

async function createMemberAccount() {
	p.intro('Generate member account');

	const {name, email, password, mock} = await p.group(
		{
			name: () =>
				p.text({
					message: 'Enter name',
					placeholder: 'John Doe',
					validate: (value) =>
						z.string().trim().min(4, 'Name too short').max(25, 'Name too long').safeParse(value)
							.error?.issues[0].message,
				}),
			email: () =>
				p.text({
					message: 'Enter email',
					placeholder: 'johndoe@expensetracker.app',
					validate: (value) => z.email('Invalid email').safeParse(value).error?.issues[0].message,
				}),
			password: () =>
				p.password({
					message: 'Enter password',
					validate: (value) =>
						z
							.string()
							.trim()
							.min(8, 'Password too short')
							.max(100, 'Password too long')
							.safeParse(value).error?.issues[0].message,
				}),
			mock: () =>
				p.confirm({
					message: 'Would you like to populate account with mock data?',
					initialValue: true,
				}),
		},
		{
			onCancel() {
				p.cancel('Process cancelled');
				process.exit(0);
			},
		},
	);

	const spinner = p.spinner();

	const startOfYear = (() => {
		const d = new Date();
		d.setMonth(0);
		d.setDate(1);
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);
		d.setMilliseconds(0);
		return d;
	})();

	spinner.start('Checking email availability');

	const exists = await prisma.account.exists({email});

	if (exists) {
		spinner.stop('Email is no longer available');
		p.cancel('Process cancelled');
		process.exit(0);
	}

	spinner.message('Creating account. Please wait');

	await prisma.account.create({
		data: {
			type: 'MEMBER',
			name,
			email,
			password: await hash(password, 8),
			expenses:
				mock === false
					? undefined
					: {
							createMany: {
								data: Array.from({length: 100}).map(() => ({
									amount: faker.number.float({
										min: 100,
										max: 100000,
										fractionDigits: 2,
									}),
									category: faker.helpers.arrayElement([
										'HOUSING',
										'UTILITIES',
										'TRANSPORTATION',
										'FOOD',
										'INSURANCE',
										'HEALTHCARE',
										'DEBT_PAYMENT',
										'PERSONAL_CARE',
										'ENTERTAINMENT',
										'SAVINGS',
										'EDUCATION',
										'CLOTHING',
										'MISCELLANEOUS',
										'OTHERS',
									]),
									location: `${faker.location.city()}, ${faker.location.country()}`,
									description: faker.word.words({
										count: {
											min: 2,
											max: 10,
										},
									}),
									transactionDate: faker.date.between({
										from: startOfYear,
										to: new Date(),
									}),
									createdAt: faker.date.between({
										from: startOfYear,
										to: new Date(),
									}),
								})),
							},
						},
		},
		select: {id: true},
	});

	spinner.stop('Account has been created');

	p.outro('Goodbye!');
}

createMemberAccount();

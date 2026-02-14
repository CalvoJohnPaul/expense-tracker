import 'dotenv/config';

import * as p from '@clack/prompts';
import {genSalt, hash} from 'bcrypt';
import * as z from 'zod';
import {prisma} from '../src/config/prisma';

async function createAdminAccount() {
	p.intro('Generate admin account');

	const {name, email, password} = await p.group(
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
		},
		{
			onCancel() {
				p.cancel('Process cancelled');
				process.exit(0);
			},
		},
	);

	const spinner = p.spinner();

	spinner.start('Checking email availability');
	try {
		p.log.info(email);

		const exists = await prisma.account.exists({email});

		if (exists) {
			spinner.stop('Email is no longer available');
			p.cancel('Process cancelled');
			process.exit(0);
		}
	} catch (error) {
		p.log.error(error instanceof Error ? error.message : 'Something went wrong.');
		p.cancel('Process cancelled');
		process.exit(0);
	}

	spinner.message('Creating account. Please wait');

	await prisma.account.create({
		data: {
			type: 'ADMIN',
			name,
			email,
			password: await hash(password, await genSalt(8)),
			permissions: [
				'CREATE_ADMIN_ACCOUNT',
				'UPDATE_ADMIN_ACCOUNT',
				'DELETE_ADMIN_ACCOUNT',
				'SUSPEND_ADMIN_ACCOUNT',
				'UNSUSPEND_ADMIN_ACCOUNT',
				'CREATE_MEMBER_ACCOUNT',
				'UPDATE_MEMBER_ACCOUNT',
				'DELETE_MEMBER_ACCOUNT',
				'SUSPEND_MEMBER_ACCOUNT',
				'UNSUSPEND_MEMBER_ACCOUNT',
			],
		},
		select: {id: true},
	});

	spinner.stop('Account has been created');

	p.outro('Goodbye!');
}

createAdminAccount();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

export type MailtoOptions =
	| {
			recipient: string;
			subject: string;
			text: string;
			html?: never;
	  }
	| {
			recipient: string;
			subject: string;
			text?: never;
			html: string;
	  };

export async function mailto(options: MailtoOptions) {
	try {
		const info = await transporter.sendMail({
			from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
			to: options.recipient,
			subject: options.subject,
			text: options.text,
			html: options.html,
		});

		console.log({info});
		return true;
	} catch (error) {
		console.error('Error sending email:', error);
		return false;
	}
}

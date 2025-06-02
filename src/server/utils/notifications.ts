'use server';
import nodemailer from 'nodemailer';
import { User } from 'better-auth';

export const newUserNotification = async (user: User) => {
    try {

        const smtp = nodemailer.createTransport({
            //host: process.env.SMTP_HOST as string,
            host: process.env.SMTP_HOST as string,
            port: parseInt(process.env.SMTP_PORT as string),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await smtp.sendMail({
            from: '[SVM] No-Reply <noreply@psikon.com>',
            to: 'adow@psikon.com',
            subject: 'New SVM User!',
            text: 'A new user with the username ' + user.name + ' has registered'
        });
    } catch (err) {
        console.error(err);
    }
}

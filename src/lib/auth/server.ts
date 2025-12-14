import { betterAuth, BetterAuthOptions } from "better-auth";
import { getDatabase } from "@/lib/db";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";
import { emailVerificationTemplate } from "@/lib/auth/templates";
import { headers } from "next/headers";

const sendMail = async (
  from: string,
  to: string,
  subject: string,
  { text, html }: { text: string; html: string }
) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: parseInt(process.env.SMTP_PORT as string),
    secure: false,
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  });

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

const options: BetterAuthOptions = {
  logger: {
    level: "debug",
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes in seconds
      strategy: "jwt",
    },
  },
  plugins: [username(), nextCookies()],
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const msg = emailVerificationTemplate(url);
      await sendMail(
        process.env.SMTP_FROM as string,
        user.email,
        "Email Verification",
        msg
      );
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  database: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db: getDatabase() as any, // Single type assertion to avoid compatibility issues
    type: "postgres",
  },
};

export const auth = betterAuth(options);

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

import { betterAuth, BetterAuthOptions } from "better-auth";
import { getDatabase } from "@/server/db";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
const options: BetterAuthOptions = {
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Seconds
        }
    },
    plugins: [
        username(),
        nextCookies()
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    database: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        db: getDatabase() as any, // Single type assertion to avoid compatibility issues
        type: 'sqlite'
    },
    
}

export const auth = betterAuth(options);


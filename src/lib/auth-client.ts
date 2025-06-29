import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
    baseURL: process.env.NEXTAUTH_URL,
    plugins: [
        usernameClient()
    ]
});

export type Session = typeof authClient.$Infer.Session;

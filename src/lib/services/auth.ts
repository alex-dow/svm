'use server';

import { headers } from "next/headers";
import { auth } from "../auth";

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error('unauthorized');
    }
    return session.user;
}

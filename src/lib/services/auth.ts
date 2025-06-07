import { headers } from "next/headers";
import { auth } from "../auth";
import { UnauthorizedError } from "../errors";


export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new UnauthorizedError();
    }
    return session.user;
}

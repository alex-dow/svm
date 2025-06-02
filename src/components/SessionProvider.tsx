'use client';

import { authClient } from "@/lib/auth-client";
import { CurrentSessionContext } from "@/lib/contexts";
type Session = Awaited<ReturnType<typeof authClient['getSession']>>


export default function SessionProvider({session,children}: {session: Session,   children: React.ReactNode}) {
    return (
        <CurrentSessionContext value={session}>
            {children}
        </CurrentSessionContext>
    )
}
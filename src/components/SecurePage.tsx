'use client';
import { authClient } from "@/lib/auth-client";
import { redirect, usePathname } from "next/navigation";

export default function SecurePage({children}: {children: React.ReactNode}) {
    const session = authClient.useSession();

    const path = usePathname();

    if (!session.data) {
        
        if (path !== '/login' && path !== '/signup') {
            console.log('user not logged in, current path is: ' + path);
            redirect('/login');
        }
    }

    return (<>{children}</>)
}
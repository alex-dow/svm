'use client';

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { UnauthorizedError } from "@/lib/errors";
import { redirect } from "next/navigation";

export default function Error({error, reset}: { error: Error & { diges?: string}, reset: ()=>void}) {



    useEffect(() => {
        if (error.name === 'UnauthorizedError') {
            console.error('Unauthorized, must sign out');
            authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        redirect('/login');
                    }
                }
            });
            
        } else {
            console.error(error);
        }
    },[error]);

    return (
        <div>
            <h3>ERROR</h3>
        </div>
    )
}
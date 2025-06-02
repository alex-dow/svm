'use client';

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

export default function AvatarMenu({username}:{username: string}) {

    const menu = useRef<OverlayPanel>(null);
    const router = useRouter();
    const label = username.charAt(0).toUpperCase();


    const onLogout = async () => {
        await authClient.signOut();
        router.push('/');
    }

    return (
        <>
            <Avatar label={label} shape='circle' onClick={(e: React.MouseEvent) => { if (menu.current) menu.current.toggle(e) }}></Avatar>
            <OverlayPanel ref={menu}>
                <Button severity="warning" label="Logout" onClick={() => onLogout()}/>
            </OverlayPanel>
        </>
    );
}
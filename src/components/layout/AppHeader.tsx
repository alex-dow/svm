import { auth } from "@/lib/auth";
import AvatarMenu from "../AvatarMenu";
import { headers } from "next/headers";
import Link from "next/link";

export default async function AppHeader() {

    const session = await auth.api.getSession({
        headers: await headers()
    });
    

    return (
        <header className="flex justify-between p-2 h-14 items-center" suppressHydrationWarning>
            <h1><Link href="/">Satisfactory Vehicle Manager</Link></h1>
            { session && 
                <div suppressHydrationWarning className="flex gap-2 items-center">
                    <span>{ session.user.name }</span>
                    <AvatarMenu username={session.user.name}/>                    
                </div>
            }
        </header>
    );
  }
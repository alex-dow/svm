"use client";

import Link from "next/link";
import AppAvatar from "./AppAvatar";
import { useSessionContext } from "@/components/contexts/SessionContextProvider";

export default function AppHeader() {
  const session = useSessionContext();
  return (
    <header className="flex justify-between items-center gap-4 border-b-2 border-b-amber-800 p-2">
      <div className="text-2xl">
        <Link href="/projects">Satisfactory Vehicle Manager</Link>
      </div>
      <div>
        <AppAvatar username={session?.user.displayUsername ?? undefined} />
      </div>
    </header>
  );
}

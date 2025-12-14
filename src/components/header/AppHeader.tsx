"use client";

import AppAvatar from "./AppAvatar";
import { useSessionContext } from "@/components/contexts/SessionContextProvider";

export default function AppHeader() {
  const session = useSessionContext();
  return (
    <header className="flex justify-between items-center gap-4 border-b-2 border-b-amber-200 p-2">
      <div>Satisfactory Vehicle Manager</div>
      <div>
        <AppAvatar username={session?.user.username ?? undefined} />
      </div>
    </header>
  );
}

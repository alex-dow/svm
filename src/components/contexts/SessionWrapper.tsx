"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { SessionContextProvider } from "./SessionContextProvider";

export default async function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <SessionContextProvider initialSession={session}>
      {children}
    </SessionContextProvider>
  );
}

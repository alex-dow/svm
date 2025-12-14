"use client";

import { createContext, useContext } from "react";
import { authClient, type Session } from "@/lib/auth/client";

type SessionContextType = Session | null;

const SessionContext = createContext<SessionContextType>(null);

export function SessionContextProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  return (
    <SessionContext.Provider value={initialSession ?? null}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}

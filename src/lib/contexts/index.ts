'use client';
import { createContext } from "react";
import { Session, User } from "better-auth";

export const CurrentSessionContext = createContext<{session: Session, user: User} | null>(null);

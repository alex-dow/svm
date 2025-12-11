"use server";
import AppAvatar from "@/components/header/AppAvatar";
import "@/css/global.css";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const username = session?.user?.name;
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Satisfactory Vehicle Manager</title>
      </head>
      <body className={`antialiased dark flex flex-col`}>
        <header className="flex justify-between items-center gap-4 border-b-2 border-b-amber-200 p-2">
          <div>Satisfactory Vehicle Manager</div>
          <div>
            <AppAvatar username={username} />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}

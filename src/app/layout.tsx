"use client";
import "@/css/global.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Satisfactory Vehicle Manager</title>
      </head>
      <body className={`antialiased dark flex flex-col`}>
        <header className="flex justify-between items-center gap-4">
          <div>Satisfactory Vehicle Manager</div>
          <div>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}

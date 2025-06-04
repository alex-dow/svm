import Loading from "@/components/Loading";
import "./globals.css";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`antialiased dark`}
      >
        
          <Suspense fallback={<Loading/>}>

            {children}
          </Suspense>
        
        
      </body>
    </html>
  );
}

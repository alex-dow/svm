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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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

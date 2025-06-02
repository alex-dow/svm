import "./globals.css";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Suspense } from "react";


function PageLoading() {
  return (
    <ProgressSpinner />
  )
}

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
        
          <Suspense fallback={<PageLoading/>}>

            {children}
          </Suspense>
        
        
      </body>
    </html>
  );
}

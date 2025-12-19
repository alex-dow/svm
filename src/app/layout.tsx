import SessionWrapper from "@/components/contexts/SessionWrapper";
import { ToastContextProvider } from "@/components/contexts/ToastContextProvider";
import AppHeader from "@/components/header/AppHeader";
import "@/css/global.css";
import { PrimeReactProvider } from "primereact/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Satisfactory Vehicle Manager</title>
      </head>
      <body className={`antialiased dark flex flex-col`}>
        <PrimeReactProvider>
          <ConfirmPopup />
          <Suspense fallback={<ProgressSpinner />}>
            <SessionWrapper>
              <AppHeader />
              <ToastContextProvider>{children}</ToastContextProvider>
            </SessionWrapper>
          </Suspense>
        </PrimeReactProvider>
      </body>
    </html>
  );
}

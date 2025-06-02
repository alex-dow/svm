import AppHeader from "@/components/layout/AppHeader";
import { Suspense } from "react";

export default async function ProjectsRootLayout({children}: {children: React.ReactNode}) {
  
    return (
        <>
            <AppHeader  />
            <main className="flex flex-col flex-1">
                <Suspense fallback={<p>LOADING</p>}>
                    {children}
                </Suspense>
            </main>
        </>
    )
}
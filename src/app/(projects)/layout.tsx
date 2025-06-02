import AppHeader from "@/components/layout/AppHeader";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default async function ProjectsRootLayout({children}: {children: React.ReactNode}) {
  
    return (
        <>
            <AppHeader  />
            <main className="flex flex-col flex-1">
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </main>
        </>
    )
}
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default async function TrainStationPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={(<Loading />)}>
            { children }
        </Suspense>
    );
}
import { Suspense } from "react";
import StationNavHeader from "./StationNavHeader";
import { StationNavList } from "./StationNavList";
import Loading from "../Loading";

export async function StationNavPanel({projectId}: {projectId: number}) {


    return (
        <div className="flex flex-col flex-1">
            <StationNavHeader projectId={projectId}/>
            <div className="flex flex-1  overflow-auto">
                <Suspense fallback={(<Loading />)}>
                    <StationNavList projectId={projectId} />
                </Suspense>
            </div>
        </div>
    );
}
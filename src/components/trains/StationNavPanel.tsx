import StationNavHeader from "./StationNavHeader";
import { StationNavList } from "./StationNavList";

export async function StationNavPanel({projectId}: {projectId: number}) {


    return (
        <div className="flex flex-col flex-1">
            <StationNavHeader projectId={projectId}/>
            <div className="flex flex-1  overflow-auto">
            <StationNavList projectId={projectId} />
            </div>
        </div>
    );
}
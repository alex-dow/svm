import { getTrainStations } from "@/lib/services/stations";
import { StationNavListItem } from "./StationNavListItem";

export interface StationNavListProps {
    projectId: number
}

export async function StationNavList({projectId}: StationNavListProps) {

    const stations = await getTrainStations(projectId);

    return (
        <div className="flex min-h-full" style={{height: 'fit-content'}}>
            {stations.length > 0 && <ul>
                { stations.map((station) => <StationNavListItem key={station.id} stationId={station.id} stationName={station.name} projectId={projectId}/>)}
            </ul>
            }
            {stations.length == 0 && (
                <span>You have no stations setup.</span>
            )}
        </div>
    )
}
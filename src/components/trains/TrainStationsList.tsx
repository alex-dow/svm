import { getCachedTrainStations } from "@/lib/services/stations";
import { TrainStationsListItem } from "./TrainStationsListItem";

export default async function TrainStationsList({projectId, ownerId}: {projectId: number, ownerId: string}) {
    
    const trainStations = await getCachedTrainStations(projectId, ownerId);

    return (
        <div className="flex min-h-full" style={{height: 'fit-content'}}>
            {trainStations.length > 0 && <ul className="w-full">
                { trainStations.map((station) => 
                    <TrainStationsListItem 
                        key={station.id} 
                        stationId={station.id} 
                        stationName={station.name} 
                        projectId={projectId}
                    />
                )}
            </ul>
            }
            {trainStations.length == 0 && (
                <span>You have no stations setup.</span>
            )}

        </div>
    )
    
}
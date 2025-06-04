import { TrainStationsListItem } from "./TrainStationsListItem";
import { handleGetTrainStations } from "@/lib/actions/trainStations";

export default async function TrainStationsList({projectId}: {projectId: number}) {
    
    const trainStations = await handleGetTrainStations(projectId);

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
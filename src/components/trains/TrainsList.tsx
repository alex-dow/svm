import { handleGetTrains } from '@/lib/actions/trains';
import TrainsListItem from './TrainsListItem';

export default async function TrainsList({projectId}: {projectId: number}) {
    
    const trains = await handleGetTrains(projectId);

    return (
        <div className="flex min-h-full" style={{height: 'fit-content'}}>
            {trains.length > 0 && <ul className="w-full">
                { trains.map((train) => 
                    <TrainsListItem
                        key={train.id} 
                        trainId={train.id}
                        trainName={train.name}
                        projectId={projectId}
                    />
                )}
            </ul>
            }
            {trains.length == 0 && (
                <span>You have no trains setup.</span>
            )}

        </div>
    )
    
}
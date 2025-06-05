import AddStopButton from "@/components/trains/AddStopButton";
import { handleGetTimetable } from "@/lib/actions/trains";

export default async function TrainPage({
  params,
}: {
  params: Promise<{ projectId: number; trainId: number }>;
}) {

    const { projectId, trainId } = await params;

    const timetable = await handleGetTimetable(trainId);

    return (
        <div className="flex">
            <div className="flex flex-col w-1/2">
            <p>TIME TABLE</p>
            <AddStopButton projectId={projectId} trainId={trainId}/>
            <ul>
                {timetable.map((stop, idx) => (
                    (<p key={stop.id}>#{idx+1} - {stop.station_name}</p>)
                ))}
            </ul>
            </div>
            <div className="flex w-1/2">
            <p>LOADING ITEMS</p>
            <p>UNLOADING ITEMS</p>
            </div>

        </div>
    )
}
import { getTrainTimetableStop } from "@/lib/services/trains";
import { MoveStopButton } from "./MoveStopButton";
import DeleteStopButton from "../platforms/buttons/DeleteStopButton";

export default async function StopAccordionTabHeader({
  stop,
  totalStops,
}: {
  stop: Exclude<Awaited<ReturnType<typeof getTrainTimetableStop>>, null | undefined>;
  totalStops: number
  projectId: number
}) {
  return (
    <div className="flex flex-1 justify-between items-center">
      <div>
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-400">#{stop?.id}</div>
          <h1>#{stop?.position} #{stop?.station_name}</h1>
          
        </div>
      </div>
      
      <div className="flex gap-1">
        <MoveStopButton 
            disabled={stop?.position == totalStops} 
            trainId={stop?.consist_id} 
            stopId={stop?.id} 
            position={stop?.position} 
            direction="down"
        />
        <MoveStopButton
            disabled={stop?.position == 1} 
            trainId={stop?.consist_id} 
            stopId={stop?.id} 
            position={stop?.position} 
            direction="up"
        />
        <DeleteStopButton stopId={stop?.id}/>
      </div>
    </div>
  );
}

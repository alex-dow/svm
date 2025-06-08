import { getTrainTimetableStop } from "@/lib/services/trains";
import { MoveStopButton } from "./MoveStopButton";
import DeleteStopButton from "../platforms/buttons/DeleteStopButton";
import { handleGetStopItems } from "@/lib/actions/trains";
import { items } from "@/lib/satisfactory/data";
import Image from "next/image";

export default async function StopAccordionTabHeader({
  stop,
  totalStops,
}: {
  stop: Exclude<Awaited<ReturnType<typeof getTrainTimetableStop>>, null | undefined>;
  totalStops: number
  projectId: number
}) {



  const stopItems = await handleGetStopItems(stop.id);

  return (




    <div className="flex flex-1 justify-between items-center">
      <div>
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-400">#{stop?.id}</div>
          <h1>#{stop?.position} #{stop?.station_name}</h1>
          
        </div>
      </div>
      <div className="flex flex-1">
        {stopItems.map((item) => {
          const itemData = items[item.item_id];
          return (<Image src={"/data/items/" + itemData.icon + "_64.png"} key={item.item_id} alt={itemData.name} width={32} height={32}/>)
        })}
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

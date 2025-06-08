import { getTrainTimetableStop } from "@/lib/services/trains";
import { MoveStopButton } from "./MoveStopButton";
import DeleteStopButton from "../platforms/buttons/DeleteStopButton";
import { handleGetStopItems } from "@/lib/actions/trains";
import { items } from "@/lib/satisfactory/data";
import Image from "next/image";
import { Badge } from "primereact/badge";

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




    <div className="flex flex-1 justify-between items-center gap-4">
      <div className="flex flex-col w-1/3">
          <h1>#{stop?.position} #{stop?.station_name}</h1>
          <div className="text-xs text-gray-400">ID: #{stop?.id}</div>
      </div>
      <div className="flex flex-1 gap-2">
        {stopItems.map((item) => {
          const itemData = items[item.item_id];
          return (
            <div className="p-overlay-badge" key={item.mode + '-' +item.item_id}>
                <Image 
                    src={"/data/items/" + itemData.icon + "_64.png"} 
                    
                    alt={itemData.name} 
                    title={item.mode.charAt(0).toUpperCase() + item.mode.slice(1) + " " + itemData.name}
                    width={32} 
                    height={32}
                />
                <Badge severity={item.mode === 'loading' ? 'success' : 'danger'} />
            </div>
          )
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

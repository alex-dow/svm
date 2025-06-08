import { TrainStationPlatform } from "@/server/db/schemas/trainStations";
import { TogglePlatformModeButton } from "./buttons/TogglePlatformModeButton";
import { MovePlatformButton } from "./buttons/MovePlatformButton";
import { DeletePlatformButton } from "./buttons/DeletePlatformButton";
import { handleGetPlatformItems } from "@/lib/actions/trainStations";
import { items } from "@/lib/satisfactory/data";
import Image from "next/image";

export default async function PlatformAccordionHeader({
  platform,
  totalPlatforms,
}: {
  platform: TrainStationPlatform;
  totalPlatforms: number
  projectId: number
}) {


  const platformItems = await handleGetPlatformItems(platform.id);
  
  return (
    <div className="flex flex-1 items-center gap-4">
      <div>
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-400">#{platform.id}</div>
          <h1>Platform #{platform.position}</h1>
        </div>

        <span className="text-sm text-gray-400">Mode: { platform.mode === 'loading' ? 'Loading' : 'Unloading'}</span>
      </div>
      <div className="flex gap-1 flex-1">
          {platformItems.map((item) => {
            const itemData = items[item.item_id];


            return (<Image src={"/data/items/" + itemData.icon + "_64.png"} key={item.item_id} alt={itemData.name} width={32} height={32}/>)
          })}

      </div>      
      <div className="flex gap-1 justify-end">
        <TogglePlatformModeButton platformId={platform.id} mode={platform.mode}/>
        <MovePlatformButton disabled={platform.position == totalPlatforms} direction="down" platformId={platform.id} position={platform.position}/>
        <MovePlatformButton disabled={platform.position == 1} direction="up" platformId={platform.id} position={platform.position}/>
        <DeletePlatformButton platformId={platform.id}/>
      </div>
    </div>
  );
}

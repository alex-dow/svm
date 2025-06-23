import { TrainStationPlatform } from "@/server/db/schemas/trainStations";
import { TogglePlatformModeButton } from "./buttons/TogglePlatformModeButton";
import { MovePlatformButton } from "./buttons/MovePlatformButton";
import { DeletePlatformButton } from "./buttons/DeletePlatformButton";
import { handleGetPlatformItems } from "@/lib/actions/trainStations";
import { items } from "@/lib/satisfactory/data";
import Image from "next/image";
import { Badge } from "primereact/badge";
import { AddItemButton } from "./buttons/AddItemButton";

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
          
          <h1>Platform #{platform.position}</h1>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-gray-400">ID: #{platform.id}</div>
          <div className="text-xs text-gray-400">Mode: { platform.mode === 'loading' ? 'Loading' : 'Unloading'}</div>
        </div>
      </div>
      <div className="flex gap-1 flex-1 w-1/3">
          {platformItems.map((item) => {
            const itemData = items[item.item_classname];
            return (
              <div className="p-overlay-badge" key={item.item_classname}>
                <Image 
                  src={"/data/items/" + itemData.icon + "_64.png"} 
                  key={item.item_classname} 
                  alt={itemData.name} 
                  width={32} 
                  height={32}
                  title={platform.mode.charAt(0).toUpperCase() + platform.mode.slice(1) + " " + itemData.name}
                />
                <Badge 
                  severity={platform.mode === 'loading' ? 'success' : 'danger'} 
                  value={item.rate} 
                  style={{'fontSize': '10px', 'lineHeight': '0.5rem', 'height': '1rem'}} 
                  className="p-1" />
              </div>
            )
          })}

      </div>      
      <div className="flex gap-1 justify-end">
        <AddItemButton platformId={platform.id} />
        <TogglePlatformModeButton platformId={platform.id} mode={platform.mode}/>
        <MovePlatformButton disabled={platform.position == totalPlatforms} direction="down" platformId={platform.id} position={platform.position}/>
        <MovePlatformButton disabled={platform.position == 1} direction="up" platformId={platform.id} position={platform.position}/>
        <DeletePlatformButton platformId={platform.id}/>
      </div>
    </div>
  );
}

import { TrainStationPlatform } from "@/server/db/schemas/trainStations";
import { TogglePlatformModeButton } from "./buttons/TogglePlatformModeButton";
import { MovePlatformButton } from "./buttons/MovePlatformButton";
import { DeletePlatformButton } from "./buttons/DeletePlatformButton";

export default async function PlatformAccordionHeader({
  platform,
  totalPlatforms,
}: {
  platform: TrainStationPlatform;
  totalPlatforms: number
  projectId: number
}) {
  return (
    <div className="flex flex-1 justify-between items-center">
      <div>
        <div className="flex gap-1 items-center">
          <div className="text-xs text-gray-400">#{platform.id}</div>
          <h1>Platform #{platform.position}</h1>
          
        </div>
        <span className="text-sm text-gray-400">Mode: { platform.mode === 'loading' ? 'Loading' : 'Unloading'}</span>
      </div>
      
      <div className="flex gap-1">
        <TogglePlatformModeButton platformId={platform.id} mode={platform.mode}/>
        <MovePlatformButton disabled={platform.position == totalPlatforms} direction="down" platformId={platform.id} position={platform.position}/>
        <MovePlatformButton disabled={platform.position == 1} direction="up" platformId={platform.id} position={platform.position}/>
        <DeletePlatformButton platformId={platform.id}/>
      </div>
    </div>
  );
}

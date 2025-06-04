import PlatformAccordionTabHeader from "./PlatformAccordionTabHeader";
import ItemsList from "./ItemsList";
import { TrainStationPlatformItem } from "@/server/db/schemas/trainStations";

export default async function PlatformAccordionTab({platformId}: {platformId: number}) {

    const items: TrainStationPlatformItem[] = [];
    
    return (
        <>
            <PlatformAccordionTabHeader platformId={platformId} />
            <ItemsList platformId={platformId} items={items}/>
        </>
    )

}
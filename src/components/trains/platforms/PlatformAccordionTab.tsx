import PlatformAccordionTabHeader from "./PlatformAccordionTabHeader";
import ItemsList from "./ItemsList";
import { handleGetPlatformItems } from "@/lib/actions/trainStations";

export default async function PlatformAccordionTab({platformId}: {platformId: number}) {

    const items = await handleGetPlatformItems(platformId);
    
    return (
        <>
            <PlatformAccordionTabHeader platformId={platformId} />
            <ItemsList platformId={platformId} items={items}/>
        </>
    )

}
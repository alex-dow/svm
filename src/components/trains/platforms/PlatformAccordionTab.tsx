import PlatformAccordionTabHeader from "./PlatformAccordionTabHeader";
import ItemsList from "./ItemsList";
import { getPlatformItems } from "@/lib/services/stationPlatforms";

export default async function PlatformAccordionTab({platformId}: {platformId: number}) {

    const items = await getPlatformItems(platformId);
    return (
        <>
            <PlatformAccordionTabHeader platformId={platformId} />
            <ItemsList platformId={platformId} items={items}/>
        </>
    )

}
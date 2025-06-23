import ItemsList from "./ItemsList";
import { handleGetPlatformItems } from "@/lib/actions/trainStations";

export default async function PlatformAccordionTab({platformId}: {platformId: number}) {

    const items = await handleGetPlatformItems(platformId);
    
    if (items.length === 0) {
        return (
            <>
                <div>
                    This platform is empty.
                </div>
            </>
        );
    } else {
        return (
            <>
                <ItemsList platformId={platformId} items={items}/>
            </>
        );
    }

}
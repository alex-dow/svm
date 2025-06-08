import { handleGetAllPlatformItems } from "@/lib/actions/trainStations";
import NetworkOverviewContainer from "./networkOverview/NetworkOverviewContainer";

export default async function NetworkOverview({ projectId }: { projectId: number }) {

    const items = await handleGetAllPlatformItems(projectId);
    console.log('network items', items);
    
    return (
        <NetworkOverviewContainer items={items} />
    )


}
import NetworkOverviewContainer from "./networkOverview/NetworkOverviewContainer";
import { handleGetTrainNetworkItems } from "@/lib/actions/trainNetwork";

export default async function NetworkOverview({ projectId }: { projectId: number }) {

    const items = await handleGetTrainNetworkItems(projectId);
    
    return (
        <NetworkOverviewContainer items={items} />
    )


}
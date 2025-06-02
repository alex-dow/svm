import CreateStationButton from "./CreateStationButton";

export default async function StationNavHeader({projectId}: {projectId: number}) {
    return (
        <CreateStationButton projectId={projectId}/>
    )
}
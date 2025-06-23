import NavLink from "../layout/NavLink";
import DeleteStationButton from "./DeleteStationButton";

export interface TrainStationsListItemProps {
    stationName: string,
    stationId: number,
    projectId: number
};

export async function TrainStationsListItem({stationName, stationId, projectId}: TrainStationsListItemProps) {

    return (
        <li className="flex justify-between items-center ">
            <NavLink
                href={'/projects/' + projectId + '/trains/stations/' + stationId}
                
                className="p-0.5 hover:bg-gray-800"
            >
                {stationName}
            </NavLink>
            <DeleteStationButton projectId={projectId} stationId={stationId}  />
        </li>
    )
}
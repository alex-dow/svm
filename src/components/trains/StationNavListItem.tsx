import NavLink from "../layout/NavLink";
import DeleteStationButton from "./DeleteStationButton";

export interface StationNavListItemProps {
    stationName: string,
    stationId: number,
    projectId: number
};

export async function StationNavListItem({stationName, stationId, projectId}: StationNavListItemProps) {

    return (
        <li className="flex justify-between items-center">
            <NavLink
                href={'/projects/' + projectId + '/trains/stations/' + stationId}
            >
                {stationName}
            </NavLink>
            <DeleteStationButton projectId={projectId} stationId={stationId}  />
        </li>
    )
}
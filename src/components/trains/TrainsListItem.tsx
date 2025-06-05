import NavLink from "../layout/NavLink";
import DeleteTrainButton from "./DeleteTrainButton";

export interface TrainsListItemProps {
    trainName: string,
    trainId: number,
    projectId: number
};

export default async function TrainsListItem({trainName, trainId, projectId}: TrainsListItemProps) {

    return (
        <li className="flex justify-between items-center">
            <NavLink
                href={'/projects/' + projectId + '/trains/train/' + trainId}
            >
                {trainName}
            </NavLink>
            <DeleteTrainButton projectId={projectId} trainId={trainId}  />
        </li>
    )
}
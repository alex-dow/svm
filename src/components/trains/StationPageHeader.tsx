import AddPlatformButton from "./AddPlatformButton";

export interface StationPageHeaderProps {
    stationId: number
    stationName: string
}

export default async function StationPageHeader({stationId, stationName}: StationPageHeaderProps) {
    return (
        <div className="flex justify-between">
            <div>{stationName}</div>
            <AddPlatformButton stationId={stationId} />
        </div>
    );

}
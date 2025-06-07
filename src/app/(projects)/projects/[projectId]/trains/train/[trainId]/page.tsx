import AddStopButton from "@/components/trains/AddStopButton";
import DeleteStopButton from "@/components/trains/platforms/buttons/DeleteStopButton";
import StopItems from "@/components/trains/timetable/StopItems";
import { handleGetTimetable } from "@/lib/actions/trains";
import { Accordion, AccordionTab } from "primereact/accordion";

export default async function TrainPage({
  params,
}: {
  params: Promise<{ projectId: number; trainId: number }>;
}) {

    const { projectId, trainId } = await params;

    const timetable = await handleGetTimetable(trainId);

    return (
        <div className="flex">
            <div className="flex flex-col w-1/2">
            <p>TIME TABLE</p>
            <AddStopButton projectId={projectId} trainId={trainId}/>
            <Accordion multiple>
                {timetable.map((stop, idx) => (
                    <AccordionTab key={stop.id} header={
                    <div className="flex justify-between w-full">
                        <div>#{idx+1} - {stop.station_name}</div>
                        <DeleteStopButton stopId={stop.id}/>
                    </div>}>
                        <StopItems projectId={projectId} trainId={trainId} stopId={stop.id}/>
                    </AccordionTab>
                ))}
            </Accordion>

            </div>
            <div className="flex w-1/2">
            <p>LOADING ITEMS</p>
            <p>UNLOADING ITEMS</p>
            </div>

        </div>
    )
}
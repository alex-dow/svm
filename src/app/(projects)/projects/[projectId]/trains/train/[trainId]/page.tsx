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
        <div className="flex flex-1">
            <div className="flex flex-col flex-1">
                <p>TIME TABLE</p>
                <AddStopButton projectId={projectId} trainId={trainId} />
                <Accordion multiple>
                    {timetable.map((stop, idx) => (
                        <AccordionTab key={stop.id} header={
                            <div className="flex justify-between w-full flex-1 items-center">
                                <div>#{idx+1} - {stop.station_name}</div>
                                <DeleteStopButton stopId={stop.id}/>
                            </div>
                        } pt={{
                            header: {
                                className: 'items-center'
                            }
                        }}>
                            <StopItems projectId={projectId} trainId={trainId} stopId={stop.id}/>
                        </AccordionTab>
                    ))}
                </Accordion>

            </div>
        </div>
    )
}
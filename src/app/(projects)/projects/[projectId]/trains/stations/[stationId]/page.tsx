import PlatformAccordionHeader from "@/components/trains/platforms/PlatformAccordionHeader";
import PlatformAccordionTab from "@/components/trains/platforms/PlatformAccordionTab";
import StationPageHeader from "@/components/trains/StationPageHeader";
import { handleGetStationPlatforms, handleGetTrainStation } from "@/lib/actions/trainStations";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Accordion, AccordionTab } from "primereact/accordion";

export default async function StationsListPage({
  params,
}: {
  params: Promise<{ projectId: string; stationId: string }>;
}) {
  
  const [ session, {projectId, stationId}] = await Promise.all([
    auth.api.getSession({headers: await headers()}),
    params
  ]);
  if (!session) {
    redirect('/login');
  }

  
  const stationIdInt = parseInt(stationId);

  const [ trainStation, platforms ] = await Promise.all([
    handleGetTrainStation(stationIdInt),
    handleGetStationPlatforms(stationIdInt)
   
  ])



  return (
    <>
      <StationPageHeader stationId={parseInt(stationId)} stationName={trainStation.name} />
      <p>Total platforms: {platforms.length}</p>
      {platforms.length > 0 ? (
        <Accordion multiple>
          {platforms.map((platform) => (
            <AccordionTab
              pt={{
                headerAction: {
                  className: "p-2",
                },
              }}
              header={
                <PlatformAccordionHeader
                  platform={platform}
                  totalPlatforms={platforms.length}
                  projectId={parseInt(projectId)}
                />
              }
              key={platform.id}
            >
              <PlatformAccordionTab platformId={platform.id} />
            </AccordionTab>
          ))}
        </Accordion>
      ) : (
        <p>This station has no platforms</p>
      )}
    </>
  );
}

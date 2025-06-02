import PlatformAccordionHeader from "@/components/trains/platforms/PlatformAccordionHeader";
import PlatformAccordionTab from "@/components/trains/platforms/PlatformAccordionTab";
import StationPageHeader from "@/components/trains/StationPageHeader";
import { getStationPlatforms } from "@/lib/services/stationPlatforms";
import { getTrainStation } from "@/lib/services/stations";
import { Accordion, AccordionTab } from "primereact/accordion";

export default async function StationsListPage({
  params,
}: {
  params: Promise<{ projectId: string; stationId: string }>;
}) {
  

  const { projectId, stationId } = await params;

  const platforms = await getStationPlatforms(parseInt(stationId));
  const trainStation = await getTrainStation(
    parseInt(stationId),
  );

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

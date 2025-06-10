import { getDatabase } from "@/server/db";
import { unstable_cache } from "next/cache";
import {
  CreateTrainStationPlatform,
  TrainStation,
} from "@/server/db/schemas/trainStations";
import { Project } from "@/server/db/schemas/projects";
import { StationMode } from "../types";
import {
  ImportTrain,
  ImportTrainStation,
} from "../types/satisfactory/importSaveTypes";
import { CreateTrainTimetableStopItem } from "@/server/db/schemas/trains";
import { ExportTimetableStop, ExportTrain, ExportTrainStation, ExportTrainStationPlatform } from "../types/exports";

export async function createProject(projectName: string, ownerId: string) {
  const db = getDatabase();

  const project = await db
    .insertInto("project")
    .values({
      name: projectName,
      owner_id: ownerId,
    })
    .returningAll()
    .executeTakeFirst();

  return project;
}

export async function getProjects(ownerId: string) {
  return getDatabase()
    .selectFrom("project")
    .selectAll()
    .where("owner_id", "=", ownerId)
    .execute();
}

export const getCachedProjects = (ownerId: string) =>
  unstable_cache(
    async (ownerId: string) => getProjects(ownerId),
    ["projects"],
    {
      tags: [`projects:${ownerId}`],
    }
  )(ownerId);

export async function deleteProject(projectId: number, ownerId: string) {
  const db = getDatabase();
  await db
    .deleteFrom("project")
    .where("id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .execute();
}

export async function getProject(projectId: number, ownerId: string) {
  return getDatabase()
    .selectFrom("project")
    .selectAll()
    .where("id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .executeTakeFirst();
}

export const getCachedProject = (projectId: number, ownerId: string) =>
  unstable_cache(
    async (projectId, ownerId) => getProject(projectId, ownerId),
    ["project"],
    {
      tags: [
        "project",
        `project:${projectId}`,
        `project:${projectId}:${ownerId}`,
      ],
    }
  )(projectId, ownerId);

export async function updateProject(project: Project) {
  await getDatabase()
    .updateTable("project")
    .set({
      name: project.name,
      owner_id: project.owner_id,
    })
    .where("id", "=", project.id)
    .execute();

  return getProject(project.id, project.owner_id);
}

export const exportProject = async (projectId: number, ownerId: string) => {
  const db = getDatabase();
  
  const project = await getProject(projectId, ownerId);
  if (!project) {
    throw new Error('Project not found: ' + projectId);
  }

  const [trains, trainStations] = await Promise.all([
    db.selectFrom('train')
    .select(['id','name','wagons'])
    .where('project_id','=',projectId)
    .where('owner_id','=',ownerId)
    .execute(),

    db.selectFrom('train_station')
    .select(['id', 'name'])
    .where('project_id','=',projectId)
    .where('owner_id','=',ownerId)
    .execute()
  ]);

  const trainIds = trains.map((train) => train.id);
  const trainStationIds = trainStations.map((station) => station.id);

  const [ trainStationPlatforms, trainTimetableStops ] = await Promise.all([
    db.selectFrom('train_station_platform')
    .select(['id', 'mode', 'position', 'train_station_id'])
    .where('train_station_id','in',trainStationIds)
    .execute(),

    db.selectFrom('train_timetable_stop')
    .select(['id','consist_id','position','station_id'])
    .where('consist_id','in',trainIds)
    .execute()
  ]);

  const platformIds = trainStationPlatforms.map((platform) => platform.id);
  const trainTimetableStopIds = trainTimetableStops.map((stop) => stop.id);

  const [ trainStationPlatformItems, trainTimetableStopItems ] = await Promise.all([
    db.selectFrom('train_station_platform_item')
    .select(['id','item_classname','platform_id','rate'])
    .where('platform_id','in', platformIds)
    .execute(),

    db.selectFrom('train_timetable_stop_item')
    .select(['id','item_classname','mode','stop_id'])
    .where('stop_id','in', trainTimetableStopIds)
    .execute()
  ]);

    const mappedTrainStations = trainStations.reduce((a, train) => {
        const stationPlatforms = trainStationPlatforms
            .filter((platform) => platform.train_station_id === train.id)
            .reduce((a, platform) => {
                const items = trainStationPlatformItems
                                           .filter((item) => item.platform_id === platform.id);
                a.push({
                    ...platform,
                    items
                });
                return a;
            }, [] as ExportTrainStationPlatform[])

        a.push({...train, platforms: stationPlatforms})
        
        return a;
    }, [] as ExportTrainStation[]);

    const mappedTrains = trains.reduce((a, train) => {

        const timetable = trainTimetableStops.reduce((a, stop) => {
            const items = trainTimetableStopItems.filter((item) => item.stop_id === stop.id);
            a.push({...stop, items});
            return a;
        }, [] as ExportTimetableStop[])

        a.push({...train, timetable});
        return a;
    }, [] as ExportTrain[])  


  return {
    projectName: project.name,
    trains: mappedTrains,
    trainStations: mappedTrainStations
  }


  
};

export type ProjectExport = Awaited<ReturnType<typeof exportProject>>;

export interface ImportProjectParameters {
  projectName: string;
  ownerId: string;
  saveFileTrainStations: ImportTrainStation[];
  saveFileTrains: ImportTrain[];
}

export const importSaveFileProject = async ({
  projectName,
  ownerId,
  saveFileTrainStations,
  saveFileTrains,
}: ImportProjectParameters) => {
  const db = getDatabase();

  return db.transaction().execute(async (trx) => {
    let trainStations: TrainStation[] = [];

    const project = await trx
      .insertInto("project")
      .values({
        name: projectName,
        owner_id: ownerId,
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    if (saveFileTrainStations.length > 0) {
      trainStations = await trx
        .insertInto("train_station")
        .values(
          saveFileTrainStations.map((s) => ({
            name: s.stationName,
            owner_id: ownerId,
            project_id: project.id,
          }))
        )
        .returningAll()
        .execute();

      const platforms = saveFileTrainStations.reduce((a, s, idx) => {
        if (s.platforms.length > 0) {
          for (let i = 1; i <= s.platforms.length; i++) {
            a.push({
              mode: s.platforms[i - 1].mode,
              owner_id: ownerId,
              train_station_id: trainStations[idx].id,
              position: i,
            });
          }
        }

        return a;
      }, [] as CreateTrainStationPlatform[]);

      if (platforms.length > 0) {
        await trx
          .insertInto("train_station_platform")
          .values(platforms)
          .returningAll()
          .execute();
      }
    }

    if (saveFileTrains.length > 0) {
      const trains = await trx
        .insertInto("train")
        .values(
          saveFileTrains.map((t) => {
            return {
              name: t.trainName,
              owner_id: ownerId,
              project_id: project.id,
              wagons: t.wagons,
            };
          })
        )
        .returningAll()
        .execute();

      for (let i = 0; i < trains.length; i++) {
        const timetable = saveFileTrains[i].timetable;
        const trainId = trains[i].id;

        // we can't add the time table, if the time table contains
        // a station that wasn't imported

        let stopValues;

        try {
          stopValues = timetable.map((stop, idx) => {
            const stationIdx = saveFileTrainStations.findIndex(
              (ts) => ts.instanceName === stop.stationInstanceName
            );
            if (stationIdx === -1) {
              throw new Error(
                "Train timetable stop has an unknown station. Station: " +
                  stop.stationInstanceName
              );
            }

            return {
              consist_id: trainId,
              owner_id: ownerId,
              position: idx + 1,
              station_id: trainStations[stationIdx].id,
            };
          });

          const stops = await trx
            .insertInto("train_timetable_stop")
            .values(stopValues)
            .returningAll()
            .execute();

          const stopItems = stops.reduce<CreateTrainTimetableStopItem[]>(
            (a, stop, idx) => {
              const loadingItems = timetable[idx].loadingItems;
              const unloadingItems = timetable[idx].unloadingItems;

              a.push(
                ...loadingItems.map((item) => {
                  return {
                    owner_id: ownerId,
                    stop_id: stop.id,
                    item_classname: item,
                    mode: "loading" as StationMode, // <-- why do I need to do this?
                  };
                })
              );

              a.push(
                ...unloadingItems.map((item) => {
                  return {
                    owner_id: ownerId,
                    stop_id: stop.id,
                    item_classname: item,
                    mode: "unloading" as StationMode,
                  };
                })
              );

              return a;
            },
            []
          );

          if (stopItems.length > 0) {
            await trx
              .insertInto("train_timetable_stop_item")
              .values(stopItems)
              .returningAll()
              .execute();
          }
        } catch (err) {
          if (err instanceof Error) {
            console.warn(err.message);
            continue;
          } else {
            throw err;
          }
        }
      }
    }

    return project.id;
  });
};

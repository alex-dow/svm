'use server';
import { getServerSession } from "@/lib/auth/server";
import { createTrainStation, deleteTrainStation, getTrainStation, getTrainStations, updateTrainStation } from "../services/trainStations";

export async function getTrainStationsAction(projectId: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const trains = await getTrainStations({projectId, ownerId});
  return trains;
}

export async function createTrainStationAction(projectId: number, name: string) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const train = await createTrainStation({ name, ownerId, projectId });
  console.log('train:', train);
  return train;
}

export async function deleteTrainStationAction(projectId: number, id: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  await deleteTrainStation({ id, projectId, ownerId });

}

export async function renameTrainStationAction(projectId: number, id: number, name: string) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const trainStation = await getTrainStation({ id, projectId, ownerId });
  trainStation.name = name;

  const res = await updateTrainStation({ id, projectId, ownerId, trainStation });
  if (res.numUpdatedRows === 0n) {
    throw new Error("Train Station not found");
  }
  const newTrainStation = await getTrainStation({ id, projectId, ownerId });
  return newTrainStation;
}
'use server';
import { getServerSession } from "@/lib/auth/server";
import { createTrain, deleteTrain, getTrain, getTrains, updateTrain } from "@/lib/services/trains";

export async function getTrainsAction(projectId: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const trains = await getTrains({projectId, ownerId});
  return trains;
}

export async function createTrainAction(projectId: number, name: string) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const train = await createTrain({ name, ownerId, projectId });
  console.log('train:', train);
  return train;
}

export async function deleteTrainAction(projectId: number, id: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  await deleteTrain({ id, projectId, ownerId });

}

export async function renameTrainAction(projectId: number, id: number, name: string) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const train = await getTrain({ id, projectId, ownerId });
  train.name = name;

  const res = await updateTrain({ id, projectId, ownerId, train });
  if (res.numUpdatedRows === 0n) {
    throw new Error("Train not found");
  }
  const newTrain = await getTrain({ id, projectId, ownerId });
  return newTrain;
}
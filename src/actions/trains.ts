'use server';
import { getServerSession } from "@/lib/auth/server";
import { createTrain, deleteTrain, getTrains } from "@/lib/services/trains";

export async function getTrainsAction(projectId: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const trains = await getTrains({projectId, ownerId});
  return trains;
}

export async function createTrainAction(name: string, projectId: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const train = await createTrain({ name, ownerId, projectId });
  console.log('train:', train);
  return train;
}

export async function deleteTrainAction(id: number, projectId: number) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  await deleteTrain({ id, projectId, ownerId });

}
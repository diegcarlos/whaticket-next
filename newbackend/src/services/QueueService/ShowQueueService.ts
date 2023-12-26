import { PrismaClient, queues as Queue } from "@prisma/client";
import AppError from "../../errors/AppError";
const prisma = new PrismaClient();

const ShowQueueService = async (queueId: number): Promise<Queue> => {
  const queue = await prisma.queues.findUnique({ where: { id: queueId } });

  if (!queue) {
    throw new AppError("ERR_QUEUE_NOT_FOUND");
  }

  return queue;
};

export default ShowQueueService;

import { PrismaClient } from "@prisma/client";
import ShowQueueService from "./ShowQueueService";

const prisma = new PrismaClient();

const DeleteQueueService = async (queueId: number): Promise<void> => {
  const queue = await ShowQueueService(queueId);

  await prisma.queues.delete({ where: { id: queue.id } });
};

export default DeleteQueueService;

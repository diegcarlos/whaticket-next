import { PrismaClient, queues as Queue } from "@prisma/client";

const prisma = new PrismaClient();

const ListQueuesService = async (): Promise<Queue[]> => {
  const queues = await prisma.queues.findMany({ orderBy: { name: "asc" } });

  return queues;
};

export default ListQueuesService;

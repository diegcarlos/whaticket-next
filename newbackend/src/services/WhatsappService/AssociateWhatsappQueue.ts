import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";

const prisma = new PrismaClient();

const AssociateWhatsappQueue = async (
  whatsapp: Whatsapp,
  queueIds: number[]
): Promise<void> => {
  await prisma.whatsapps.update({
    where: { id: whatsapp.id },
    data: {
      queues: {
        connect: queueIds.map((id) => ({ id })),
      },
    },
  });
};

export default AssociateWhatsappQueue;

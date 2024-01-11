import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";

const prisma = new PrismaClient();

const AssociateWhatsappQueue = async (
  whatsapp: Whatsapp,
  queueIds: number[]
): Promise<void> => {
  await prisma.whatsapps.update({
    where: { id: whatsapp.id },
    data: {
      whatsappqueues: {
        updateMany: {
          data: queueIds.map((id) => ({ id })),
          where: { whatsappId: whatsapp.id },
        },
      },
    },
  });
};

export default AssociateWhatsappQueue;

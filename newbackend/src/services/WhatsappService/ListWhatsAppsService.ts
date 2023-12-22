import {
  PrismaClient,
  whatsapps as WhatsApp,
  whatsappqueues as WhatsAppQueue,
} from "@prisma/client";

interface WhatsAppSerialize extends WhatsApp {
  queues: WhatsAppQueue[];
}

const ListWhatsAppsService = async (): Promise<WhatsAppSerialize[]> => {
  const prisma = new PrismaClient();
  const whatsapp = await prisma.whatsapps.findMany();

  let whatsAppQueue: WhatsAppSerialize[] = [];

  for (let iw = 0; iw < whatsapp.length; iw += 1) {
    const w: WhatsAppSerialize = whatsapp[iw] as WhatsAppSerialize;

    const queues = await prisma.whatsappqueues.findMany({
      where: { whatsappId: w.id },
    });

    w.queues = queues;

    whatsAppQueue = [...whatsAppQueue, w];
  }

  return whatsAppQueue;
};

export default ListWhatsAppsService;

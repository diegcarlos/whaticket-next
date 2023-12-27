import AppError from "../../errors/AppError";

import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";

const prisma = new PrismaClient();

const ShowWhatsAppService = async (id: number): Promise<Whatsapp> => {
  const whatsapp = await prisma.whatsapps.findUnique({
    where: { id: Number(id) },
    include: {
      queues: {
        select: { id: true, name: true, color: true, greetingMessage: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!whatsapp) {
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }

  return whatsapp;
};

export default ShowWhatsAppService;

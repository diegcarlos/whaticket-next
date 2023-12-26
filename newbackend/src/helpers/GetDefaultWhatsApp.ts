import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";
import AppError from "../errors/AppError";
import GetDefaultWhatsAppByUser from "./GetDefaultWhatsAppByUser";

const prisma = new PrismaClient();

const GetDefaultWhatsApp = async (userId?: number): Promise<Whatsapp> => {
  if (userId) {
    const whatsappByUser = await GetDefaultWhatsAppByUser(userId);
    if (whatsappByUser !== null) {
      return whatsappByUser;
    }
  }

  const defaultWhatsapp = await prisma.whatsapps.findFirst({
    where: { isDefault: true },
  });

  if (!defaultWhatsapp) {
    throw new AppError("ERR_NO_DEF_WAPP_FOUND");
  }

  return defaultWhatsapp;
};

export default GetDefaultWhatsApp;

import { PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

const prisma = new PrismaClient();

const DeleteWhatsAppService = async (id: number): Promise<void> => {
  const whatsapp = await prisma.whatsapps.findFirst({
    where: { id },
  });

  if (!whatsapp) {
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }

  await prisma.whatsapps.delete({ where: { id } });
};

export default DeleteWhatsAppService;

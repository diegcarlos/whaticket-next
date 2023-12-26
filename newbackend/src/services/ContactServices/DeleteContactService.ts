import { PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

const prisma = new PrismaClient();

const DeleteContactService = async (id: number): Promise<void> => {
  const contact = await prisma.contacts.findUnique({ where: { id } });

  if (!contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }
  await prisma.contacts.delete({ where: { id: contact.id } });
};

export default DeleteContactService;

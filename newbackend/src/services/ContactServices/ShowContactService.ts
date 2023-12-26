import { contacts as Contact, PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

const prisma = new PrismaClient();

const ShowContactService = async (id: number): Promise<Contact> => {
  const contact = await prisma.contacts.findUnique({
    where: { id },
    include: { extraInfo: true },
  });

  if (!contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  return contact;
};

export default ShowContactService;

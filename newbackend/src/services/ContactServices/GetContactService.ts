import { contacts as Contact, PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";
import CreateContactService from "./CreateContactService";

interface ExtraInfo {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  email?: string;
  profilePicUrl?: string;
  extraInfo?: ExtraInfo[];
}

const prisma = new PrismaClient();

const GetContactService = async ({
  name,
  number,
}: Request): Promise<Contact> => {
  const numberExists = await prisma.contacts.findFirst({ where: { number } });

  if (!numberExists) {
    const contact = await CreateContactService({
      name,
      number,
    });

    if (contact == null) throw new AppError("CONTACT_NOT_FIND");
    else return contact;
  }

  return numberExists;
};

export default GetContactService;

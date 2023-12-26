import { contacts as Contact, PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

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

const CreateContactService = async ({
  name,
  number,
  email = "",
  extraInfo = [],
}: Request): Promise<Contact> => {
  const numberExists = await prisma.contacts.findFirst({ where: { number } });

  if (numberExists) {
    throw new AppError("ERR_DUPLICATED_CONTACT");
  }

  const contact = await prisma.contacts.create({
    data: {
      name,
      number,
      email,
    },
  });

  if (extraInfo.length > 0) {
    await prisma.contactcustomfields.createMany({
      skipDuplicates: true,
      data: extraInfo.map((ex) => {
        return { ...ex, contactId: contact.id };
      }),
    });
  }

  return contact;
};

export default CreateContactService;

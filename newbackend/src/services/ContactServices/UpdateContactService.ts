import { contacts as Contact, PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

interface ExtraInfo {
  id?: number;
  name: string;
  value: string;
}
interface ContactData {
  email?: string;
  number?: string;
  name?: string;
  extraInfo?: ExtraInfo[];
}

interface Request {
  contactData: ContactData;
  contactId: number;
}

const prisma = new PrismaClient();

const UpdateContactService = async ({
  contactData,
  contactId,
}: Request): Promise<Contact | any> => {
  const { email, name, number, extraInfo } = contactData;

  let contact = await prisma.contacts.findFirst({
    where: { id: contactId },
    select: {
      id: true,
      name: true,
      number: true,
      email: true,
      profilePicUrl: true,
      extraInfo: true,
    },
  });

  if (!contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  if (extraInfo) {
    await Promise.all(
      extraInfo.map(async (info) => {
        await prisma.contactcustomfields.upsert({
          where: { contactId: contact?.id, id: info.id },
          create: {
            ...info,
            contactId: contact?.id === undefined ? 0 : contact?.id,
          },
          update: info,
        });
      })
    );

    await Promise.all(
      contact.extraInfo.map(async (oldInfo) => {
        const stillExists = extraInfo.findIndex(
          (info) => info.id === oldInfo.id
        );

        if (stillExists === -1) {
          await prisma.contactcustomfields.delete({
            where: { id: oldInfo.id },
          });
        }
      })
    );
  }

  await prisma.contacts.update({
    where: { id: contact.id },
    data: { name, number, email },
  });

  contact = await prisma.contacts.findFirst({
    where: { id: contactId },
    select: {
      id: true,
      name: true,
      number: true,
      email: true,
      profilePicUrl: true,
      extraInfo: true,
    },
  });

  return contact;
};

export default UpdateContactService;

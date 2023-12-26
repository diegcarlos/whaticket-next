import { contacts as Contact, PrismaClient } from "@prisma/client";
import { getIO } from "../../libs/socket";

interface ExtraInfo {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  isGroup: boolean;
  email?: string;
  profilePicUrl?: string;
  extraInfo?: ExtraInfo[];
}

const prisma = new PrismaClient();

const CreateOrUpdateContactService = async ({
  name,
  number: rawNumber,
  profilePicUrl,
  isGroup,
  email = "",
  extraInfo = [],
}: Request): Promise<Contact> => {
  const number = isGroup ? rawNumber : rawNumber.replace(/[^0-9]/g, "");

  const io = getIO();
  let contact: Contact | any;

  contact = await prisma.contacts.findUnique({ where: { number } });

  if (contact) {
    contact = await prisma.contacts.update({
      where: { id: contact.id },
      data: { profilePicUrl },
    });

    if (extraInfo.length > 0 && contact.id) {
      await prisma.contactcustomfields.createMany({
        skipDuplicates: true,
        data: extraInfo.map((ex) => {
          return { ...ex, contactId: contact.id };
        }),
      });
    }

    io.emit("contact", {
      action: "update",
      contact,
    });
  } else {
    contact = await prisma.contacts.create({
      data: {
        name,
        number,
        profilePicUrl,
        email,
        isGroup,
      },
    });

    if (extraInfo.length > 0 && contact.id) {
      await prisma.contactcustomfields.createMany({
        skipDuplicates: true,
        data: extraInfo.map((ex) => {
          return { ...ex, contactId: contact.id };
        }),
      });
    }

    io.emit("contact", {
      action: "create",
      contact,
    });
  }

  return contact;
};

export default CreateOrUpdateContactService;

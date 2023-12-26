import { PrismaClient } from "@prisma/client";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
import { logger } from "../../util/logger";

const prisma = new PrismaClient();

const ImportContactsService = async (userId: number): Promise<void> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(userId);

  const wbot = getWbot(defaultWhatsapp.id);

  let phoneContacts;

  try {
    phoneContacts = await wbot.getContacts();
  } catch (err) {
    logger.error(`Could not get whatsapp contacts from phone. Err: ${err}`);
  }

  if (phoneContacts) {
    await Promise.all(
      phoneContacts.map(async ({ number, name }) => {
        if (!number) {
          return null;
        }
        if (!name) {
          name = number;
        }

        const numberExists = await prisma.contacts.findUnique({
          where: { number },
        });

        if (numberExists) return null;
        return prisma.contacts.create({ data: { number, name } });
      })
    );
  }
};

export default ImportContactsService;

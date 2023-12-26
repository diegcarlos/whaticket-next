import { PrismaClient } from "@prisma/client";

import { whatsapps as Whatsapp } from "@prisma/client";
import { logger } from "../util/logger";

const prisma = new PrismaClient();

const GetDefaultWhatsAppByUser = async (
  userId: number
): Promise<Whatsapp | null> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: { whatsapps: true },
  });
  if (user === null) {
    return null;
  }

  if (user.whatsapps !== null) {
    logger.info(
      `Found whatsapp linked to user '${user.name}' is '${user.whatsapps.name}'.`
    );
  }

  return user.whatsapps;
};

export default GetDefaultWhatsAppByUser;

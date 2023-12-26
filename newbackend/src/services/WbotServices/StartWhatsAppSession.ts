import { PrismaClient, whatsapps as WhatsApp } from "@prisma/client";
import { getIO } from "../../libs/socket";
import { initWbot } from "../../libs/wbot";
import { logger } from "../../util/logger";
import { wbotMessageListener } from "./wbotMessageListener";
import wbotMonitor from "./wbotMonitor";

export const StartWhatsAppSession = async (
  whatsapp: WhatsApp
): Promise<void> => {
  const prisma = new PrismaClient();

  await prisma.whatsapps.update({
    data: { status: "OPENING" },
    where: { id: whatsapp.id },
  });

  const io = getIO();
  io.emit("whatsappSession", {
    action: "update",
    session: whatsapp,
  });

  try {
    const wbot = await initWbot(whatsapp);
    wbotMessageListener(wbot);
    wbotMonitor(wbot, whatsapp);
  } catch (err) {
    logger.error(err);
  }
};

import * as Sentry from "@sentry/node";
import { Client } from "whatsapp-web.js";

import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";
import { getIO } from "../../libs/socket";
import { logger } from "../../util/logger";
import { StartWhatsAppSession } from "./StartWhatsAppSession";

interface Session extends Client {
  id?: number;
}

const prisma = new PrismaClient();

const wbotMonitor = async (
  wbot: Session,
  whatsapp: Whatsapp
): Promise<void> => {
  const io = getIO();
  const sessionName = whatsapp.name;

  try {
    wbot.on("change_state", async (newState) => {
      logger.info(`Monitor session: ${sessionName}, ${newState}`);
      try {
        await prisma.whatsapps.update({
          where: { id: whatsapp.id },
          data: { status: newState },
        });
      } catch (err) {
        Sentry.captureException(err);
        logger.error(err);
      }

      io.emit("whatsappSession", {
        action: "update",
        session: whatsapp,
      });
    });

    wbot.on("change_battery", async (batteryInfo) => {
      const { battery, plugged } = batteryInfo;
      logger.info(
        `Battery session: ${sessionName} ${battery}% - Charging? ${plugged}`
      );

      try {
        await prisma.whatsapps.update({
          where: { id: whatsapp.id },
          data: { battery, plugged },
        });
      } catch (err) {
        Sentry.captureException(err);
        logger.error(err);
      }

      io.emit("whatsappSession", {
        action: "update",
        session: whatsapp,
      });
    });

    wbot.on("disconnected", async (reason) => {
      logger.info(`Disconnected session: ${sessionName}, reason: ${reason}`);
      try {
        await prisma.whatsapps.update({
          data: { status: "OPENING", session: "" },
          where: { id: whatsapp.id },
        });
      } catch (err) {
        Sentry.captureException(err);
        logger.error(err);
      }

      io.emit("whatsappSession", {
        action: "update",
        session: whatsapp,
      });

      setTimeout(() => StartWhatsAppSession(whatsapp), 2000);
    });
  } catch (err) {
    Sentry.captureException(err);
    logger.error(err);
  }
};

export default wbotMonitor;

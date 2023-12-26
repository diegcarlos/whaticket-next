import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";
import qrCode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";
import AppError from "../errors/AppError";
import { handleMessage } from "../services/WbotServices/wbotMessageListener";
import { logger } from "../util/logger";
import { getIO } from "./socket";

interface Session extends Client {
  id?: number;
}

const sessions: Session[] = [];

const syncUnreadMessages = async (wbot: Session) => {
  const chats = await wbot.getChats();

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  for (const chat of chats) {
    if (chat.unreadCount > 0) {
      const unreadMessages = await chat.fetchMessages({
        limit: chat.unreadCount,
      });

      for (const msg of unreadMessages) {
        await handleMessage(msg, wbot);
      }

      await chat.sendSeen();
    }
  }
};

export const initWbot = async (whatsapp: Whatsapp): Promise<Session> => {
  return new Promise((resolve, reject) => {
    try {
      const io = getIO();
      const sessionName = whatsapp.name;
      let sessionCfg;
      const prisma = new PrismaClient();

      if (whatsapp && whatsapp.session) {
        sessionCfg = JSON.parse(whatsapp.session);
      }

      const args: String = process.env.CHROME_ARGS || "";

      const wbot: Session = new Client({
        session: sessionCfg,
        authStrategy: new LocalAuth({ clientId: "bd_" + whatsapp.id }),
        puppeteer: {
          executablePath: process.env.CHROME_BIN || undefined,
          // @ts-ignore
          browserWSEndpoint: process.env.CHROME_WS || undefined,
          args: args.split(" "),
        },
      });

      wbot.initialize();

      wbot.on("qr", async (qr) => {
        logger.info("Session:", sessionName);
        qrCode.generate(qr, { small: true });
        await prisma.whatsapps.update({
          data: { qrcode: qr, status: "qrcode", retries: 0 },
          where: { id: whatsapp.id },
        });

        const sessionIndex = sessions.findIndex((s) => s.id === whatsapp.id);
        if (sessionIndex === -1) {
          wbot.id = whatsapp.id;
          sessions.push(wbot);
        }

        io.emit("whatsappSession", {
          action: "update",
          session: whatsapp,
        });
      });

      wbot.on("authenticated", async (session) => {
        logger.info(`Session: ${sessionName} AUTHENTICATED`);
      });

      wbot.on("auth_failure", async (msg) => {
        console.error(
          `Session: ${sessionName} AUTHENTICATION FAILURE! Reason: ${msg}`
        );

        if (whatsapp.retries > 1) {
          await prisma.whatsapps.update({
            data: { session: "", retries: 0 },
            where: { id: whatsapp.id },
          });
        }

        const retry = whatsapp.retries;

        await prisma.whatsapps.update({
          data: { status: "DISCONNECTED", retries: retry + 1 },
          where: { id: whatsapp.id },
        });

        io.emit("whatsappSession", {
          action: "update",
          session: whatsapp,
        });

        reject(new Error("Error starting whatsapp session."));
      });

      wbot.on("ready", async () => {
        logger.info(`Session: ${sessionName} READY`);

        await prisma.whatsapps.update({
          data: { status: "CONNECTED", retries: 0, qrcode: "" },
          where: { id: whatsapp.id },
        });

        io.emit("whatsappSession", {
          action: "update",
          session: whatsapp,
        });

        const sessionIndex = sessions.findIndex((s) => s.id === whatsapp.id);
        if (sessionIndex === -1) {
          wbot.id = whatsapp.id;
          sessions.push(wbot);
        }

        wbot.sendPresenceAvailable();
        await syncUnreadMessages(wbot);

        resolve(wbot);
      });
    } catch (err) {
      logger.error(err);
    }
  });
};

export const getWbot = (whatsappId: number): Session => {
  const sessionIndex = sessions.findIndex((s) => s.id === whatsappId);

  if (sessionIndex === -1) {
    throw new AppError("ERR_WAPP_NOT_INITIALIZED");
  }
  return sessions[sessionIndex];
};

export const removeWbot = (whatsappId: number): void => {
  try {
    const sessionIndex = sessions.findIndex((s) => s.id === whatsappId);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].destroy();
      sessions.splice(sessionIndex, 1);
    }
  } catch (err) {
    logger.error(err);
  }
};

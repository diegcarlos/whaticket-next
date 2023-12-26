import { PrismaClient, tickets as Ticket } from "@prisma/client";
import fs from "fs";
import {
  MessageMedia,
  MessageSendOptions,
  Message as WbotMessage,
} from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";

import formatBody from "../../helpers/Mustache";

interface Request {
  media: any;
  ticket: Ticket;
  body?: string;
}

const prisma = new PrismaClient();

const SendWhatsAppMedia = async ({
  media,
  ticket,
  body,
}: Request): Promise<WbotMessage> => {
  try {
    const wbot = await GetTicketWbot(ticket);
    const contact = await prisma.contacts.findUnique({
      //@ts-ignore
      where: { id: ticket.userId },
    });
    const hasBody = body ? formatBody(body as string, contact) : undefined;

    const newMedia = MessageMedia.fromFilePath(media.path);

    let mediaOptions: MessageSendOptions = {
      caption: hasBody,
      sendAudioAsVoice: true,
    };

    if (
      newMedia.mimetype.startsWith("image/") &&
      !/^.*\.(jpe?g|png|gif)?$/i.exec(media.filename)
    ) {
      mediaOptions["sendMediaAsDocument"] = true;
    }

    const sentMessage = await wbot.sendMessage(
      `${contact?.number}@${ticket.isGroup ? "g" : "c"}.us`,
      newMedia,
      mediaOptions
    );

    await prisma.tickets.update({
      where: { id: ticket.id },
      data: { lastMessage: body || media.filename },
    });

    fs.unlinkSync(media.path);

    return sentMessage;
  } catch (err) {
    console.log(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMedia;

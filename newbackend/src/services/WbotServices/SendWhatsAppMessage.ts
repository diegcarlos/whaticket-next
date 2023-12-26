import { Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import GetWbotMessage from "../../helpers/GetWbotMessage";
import SerializeWbotMsgId from "../../helpers/SerializeWbotMsgId";

import {
  messages as Message,
  PrismaClient,
  tickets as Ticket,
} from "@prisma/client";

import formatBody from "../../helpers/Mustache";

interface Request {
  body: string;
  ticket: Ticket;
  quotedMsg?: Message;
}

const prisma = new PrismaClient();

const SendWhatsAppMessage = async ({
  body,
  ticket,
  quotedMsg,
}: Request): Promise<WbotMessage> => {
  let quotedMsgSerializedId: string | undefined;
  if (quotedMsg) {
    await GetWbotMessage(ticket, quotedMsg.id);
    quotedMsgSerializedId = SerializeWbotMsgId(ticket, quotedMsg);
  }

  const wbot = await GetTicketWbot(ticket);

  try {
    const contact = await prisma.contacts.findUnique({
      //@ts-ignore
      where: { id: ticket.userId },
    });
    const sentMessage = await wbot.sendMessage(
      `${contact?.number}@${ticket.isGroup ? "g" : "c"}.us`,
      formatBody(body, contact),
      {
        quotedMessageId: quotedMsgSerializedId,
        linkPreview: false,
      }
    );

    await prisma.tickets.update({
      where: { id: ticket.id },
      data: { lastMessage: body },
    });
    return sentMessage;
  } catch (err) {
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessage;

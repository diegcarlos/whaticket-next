import { Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../errors/AppError";
import GetTicketWbot from "./GetTicketWbot";

import { contacts as Contact, tickets as Ticket } from "@prisma/client";

interface TicketContact {
  contacts: Contact;
}

type FullTicket = Ticket & TicketContact;

export const GetWbotMessage = async (
  ticket: FullTicket,
  messageId: string
): Promise<WbotMessage> => {
  const wbot = await GetTicketWbot(ticket);

  const wbotChat = await wbot.getChatById(
    `${ticket.contacts.number}@${ticket.isGroup ? "g" : "c"}.us`
  );

  let limit = 20;

  const fetchWbotMessagesGradually = async (): Promise<void | WbotMessage> => {
    const chatMessages = await wbotChat.fetchMessages({ limit });

    const msgFound = chatMessages.find((msg) => msg.id.id === messageId);

    if (!msgFound && limit < 100) {
      limit += 20;
      return fetchWbotMessagesGradually();
    }

    return msgFound;
  };

  try {
    const msgFound = await fetchWbotMessagesGradually();

    if (!msgFound) {
      throw new Error("Cannot found message within 100 last messages");
    }

    return msgFound;
  } catch (err) {
    throw new AppError("ERR_FETCH_WAPP_MSG");
  }
};

export default GetWbotMessage;

import { PrismaClient, tickets as Ticket } from "@prisma/client";
import { Client as Session } from "whatsapp-web.js";
import { getWbot } from "../libs/wbot";
import GetDefaultWhatsApp from "./GetDefaultWhatsApp";

const prisma = new PrismaClient();
const GetTicketWbot = async (ticket: Ticket): Promise<Session> => {
  if (!ticket.whatsappId) {
    const defaultWhatsapp = await GetDefaultWhatsApp(ticket.userId as any);

    await prisma.whatsapps.update({
      where: { id: ticket.whatsappId as any },
      data: defaultWhatsapp,
    });
  }

  const wbot = getWbot(ticket?.whatsappId as any);

  return wbot;
};

export default GetTicketWbot;

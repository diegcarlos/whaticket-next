import { PrismaClient, tickets as Ticket } from "@prisma/client";
import { getIO } from "../libs/socket";
import { logger } from "../util/logger";
import GetTicketWbot from "./GetTicketWbot";

const prisma = new PrismaClient();

const SetTicketMessagesAsRead = async (ticket: Ticket): Promise<void> => {
  await prisma.messages.updateMany({
    where: {
      ticketId: ticket.id,
      read: false,
    },
    data: {
      read: true,
    },
  });

  const tickets = await prisma.tickets.update({
    where: { id: ticket.id },
    data: { unreadMessages: 0 },
    include: { contacts: true },
  });

  try {
    const wbot = await GetTicketWbot(ticket);
    await wbot.sendSeen(
      `${tickets.contacts?.number}@${ticket.isGroup ? "g" : "c"}.us`
    );
  } catch (err) {
    logger.warn(
      `Could not mark messages as read. Maybe whatsapp session disconnected? Err: ${err}`
    );
  }

  const io = getIO();
  io.to(ticket.status).to("notification").emit("ticket", {
    action: "updateUnread",
    ticketId: ticket.id,
  });
};

export default SetTicketMessagesAsRead;

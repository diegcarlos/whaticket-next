import { PrismaClient, tickets as Ticket } from "@prisma/client";
import CheckContactOpenTickets from "../../helpers/CheckContactOpenTickets";
import SetTicketMessagesAsRead from "../../helpers/SetTicketMessagesAsRead";
import { getIO } from "../../libs/socket";
import ShowTicketService from "./ShowTicketService";

interface TicketData {
  status?: string;
  userId?: number;
  queueId?: number;
  whatsappId?: number;
}

interface Request {
  ticketData: TicketData;
  ticketId: number;
}

interface Response {
  ticket: Ticket;
  oldStatus: string;
  oldUserId: number | undefined;
}

const prisma = new PrismaClient();

const UpdateTicketService = async ({
  ticketData,
  ticketId,
}: Request): Promise<Response> => {
  const { status, userId, queueId, whatsappId } = ticketData;

  const ticket: any = await ShowTicketService(ticketId);
  await SetTicketMessagesAsRead(ticket);

  if (whatsappId && ticket.whatsappId !== whatsappId) {
    await CheckContactOpenTickets(ticket.contactId, whatsappId);
  }

  const oldStatus = ticket.status;
  const oldUserId = ticket.user?.id;

  if (oldStatus === "closed") {
    await CheckContactOpenTickets(ticket.contact.id, ticket.whatsappId);
  }

  await prisma.tickets.update({
    where: { id: ticket.id },
    data: {
      status,
      queueId,
      userId,
    },
  });

  if (whatsappId) {
    await prisma.tickets.update({
      where: { id: ticket.id },
      data: {
        whatsappId,
      },
    });
  }
  const reloadTicket: any = await ShowTicketService(ticket.id);

  const io = getIO();

  if (
    reloadTicket.status !== oldStatus ||
    reloadTicket.user?.id !== oldUserId
  ) {
    io.to(oldStatus).emit("ticket", {
      action: "delete",
      ticketId: reloadTicket.id,
    });
  }

  io.to(reloadTicket.status)
    .to("notification")
    .to(ticketId.toString())
    .emit("ticket", {
      action: "update",
      ticket: reloadTicket,
    });

  return { ticket: reloadTicket, oldStatus, oldUserId };
};

export default UpdateTicketService;

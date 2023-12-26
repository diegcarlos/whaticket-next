import { PrismaClient, tickets as Ticket } from "@prisma/client";
import AppError from "../../errors/AppError";

const prisma = new PrismaClient();

const DeleteTicketService = async (id: number): Promise<Ticket> => {
  const ticket = await prisma.tickets.findUnique({ where: { id } });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  await prisma.tickets.delete({ where: { id: ticket.id } });

  return ticket;
};

export default DeleteTicketService;

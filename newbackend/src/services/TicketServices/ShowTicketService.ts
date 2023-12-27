import AppError from "../../errors/AppError";

import { PrismaClient, tickets as Ticket } from "@prisma/client";

const prisma = new PrismaClient();

const ShowTicketService = async (id: number): Promise<Ticket> => {
  const ticket = await prisma.tickets.findUnique({
    where: { id: Number(id) },
    include: {
      contacts: {
        select: {
          id: true,
          name: true,
          number: true,
          profilePicUrl: true,
        },
      },
      users: {
        select: { id: true, name: true },
      },
      queues: {
        select: { id: true, name: true, color: true },
      },
      whatsapps: {
        select: { name: true },
      },
    },
  });

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  return ticket;
};

export default ShowTicketService;

import {
  contacts as Contact,
  PrismaClient,
  tickets as Ticket,
} from "@prisma/client";
import { subHours } from "date-fns";
import ShowTicketService from "./ShowTicketService";

const prisma = new PrismaClient();

const FindOrCreateTicketService = async (
  contact: Contact,
  whatsappId: number,
  unreadMessages: number,
  groupContact?: Contact
): Promise<Ticket> => {
  let ticket: any = await prisma.tickets.findFirst({
    where: {
      OR: [{ status: "open" }, { status: "pending" }],
      contactId: groupContact ? groupContact.id : contact.id,
      whatsappId: whatsappId,
    },
  });

  if (ticket) {
    await prisma.tickets.update({
      where: { id: ticket.id },
      data: { unreadMessages },
    });
  }

  if (!ticket && groupContact) {
    ticket = await prisma.tickets.findFirst({
      where: {
        contactId: groupContact.id,
        whatsappId: whatsappId,
      },
      orderBy: { updatedAt: "desc" },
    });

    if (ticket) {
      await prisma.tickets.update({
        where: {
          id: ticket.id,
        },
        data: {
          status: "pending",
          userId: null,
          unreadMessages,
        },
      });
    }
  }

  if (!ticket && !groupContact) {
    const subHoursTimestamp = +subHours(new Date(), 2);
    await prisma.tickets.findFirst({
      where: {
        updatedAt: {
          gte: new Date(subHoursTimestamp),
          lte: new Date(+new Date()),
        },
      },
    });

    if (ticket) {
      await prisma.tickets.update({
        data: {
          status: "pending",
          userId: null,
          unreadMessages,
        },
        where: { id: ticket.id },
      });
    }
  }

  if (!ticket) {
    ticket = await prisma.tickets.create({
      data: {
        contactId: groupContact ? groupContact.id : contact.id,
        status: "pending",
        isGroup: !!groupContact,
        unreadMessages,
        whatsappId,
      },
    });
  }

  ticket = await ShowTicketService(ticket.id);

  return ticket;
};

export default FindOrCreateTicketService;

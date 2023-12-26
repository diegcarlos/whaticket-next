import {
  messages as Message,
  PrismaClient,
  tickets as Ticket,
} from "@prisma/client";
import AppError from "../../errors/AppError";
import ShowTicketService from "../TicketServices/ShowTicketService";

interface Request {
  ticketId: number;
  pageNumber?: string;
}

interface Response {
  messages: Message[];
  ticket: Ticket;
  count: number;
  hasMore: boolean;
}

const prisma = new PrismaClient();

const ListMessagesService = async ({
  pageNumber = "1",
  ticketId,
}: Request): Promise<Response> => {
  const ticket = await ShowTicketService(ticketId);

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  // await setMessagesAsRead(ticket);
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const count = await prisma.messages.count();

  const messages = await prisma.messages.findMany({
    where: { ticketId },
    take: limit,
    skip: offset,
    include: { contacts: true, messages: { include: { contacts: true } } },
    orderBy: { createdAt: "desc" },
  });

  const hasMore = count > offset + messages.length;

  return {
    messages: messages.reverse(),
    ticket,
    count,
    hasMore,
  };
};

export default ListMessagesService;

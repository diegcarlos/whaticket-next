import { PrismaClient, tickets as Ticket } from "@prisma/client";
import AppError from "../../errors/AppError";
import CheckContactOpenTickets from "../../helpers/CheckContactOpenTickets";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import ShowContactService from "../ContactServices/ShowContactService";

interface Request {
  contactId: number;
  status: string;
  userId: number;
  queueId?: number;
}

const prisma = new PrismaClient();

const CreateTicketService = async ({
  contactId,
  status,
  userId,
  queueId,
}: Request): Promise<Ticket> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(userId);

  await CheckContactOpenTickets(contactId, defaultWhatsapp.id);

  const { isGroup } = await ShowContactService(contactId);

  if (queueId === undefined) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { queues: true },
    });
  }

  const { id }: Ticket = await prisma.tickets.create({
    data: {
      contactId,
      status,
      isGroup,
      userId,
      queueId,
    },
  });

  const ticket = await prisma.tickets.findUnique({
    where: { id },
    include: { contacts: true },
  });

  if (!ticket) {
    throw new AppError("ERR_CREATING_TICKET");
  }

  return ticket;
};

export default CreateTicketService;

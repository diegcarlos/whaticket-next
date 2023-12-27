import { PrismaClient, tickets as Ticket } from "@prisma/client";
import AppError from "../../errors/AppError";
import UpdateDeletedUserOpenTicketsStatus from "../../helpers/UpdateDeletedUserOpenTicketsStatus";

const prisma = new PrismaClient();

const DeleteUserService = async (id: number): Promise<void> => {
  const user = await prisma.users.findFirst({ where: { id } });

  if (!user) {
    throw new AppError("ERR_NO_USER_FOUND", 404);
  }

  const userOpenTickets: Ticket[] = await prisma.tickets.findMany({
    where: { status: "open" },
  });

  if (userOpenTickets.length > 0) {
    UpdateDeletedUserOpenTicketsStatus(userOpenTickets);
  }
  await prisma.users.delete({ where: { id: user.id } });
};

export default DeleteUserService;

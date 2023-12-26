import { PrismaClient } from "@prisma/client";
import AppError from "../errors/AppError";

const prisma = new PrismaClient();

const CheckContactOpenTickets = async (
  contactId: number,
  whatsappId: number
): Promise<void> => {
  const ticket = await prisma.tickets.findFirst({
    where: {
      contactId,
      whatsappId,
      OR: [{ status: "open" }, { status: "pending" }],
    },
  });

  if (ticket) {
    throw new AppError("ERR_OTHER_OPEN_TICKET");
  }
};

export default CheckContactOpenTickets;

import { tickets as Ticket } from "@prisma/client";
import UpdateTicketService from "../services/TicketServices/UpdateTicketService";

const UpdateDeletedUserOpenTicketsStatus = async (
  tickets: Ticket[]
): Promise<void> => {
  tickets.forEach(async (t) => {
    const ticketId = t.id.toString();

    await UpdateTicketService({
      ticketData: { status: "pending" },
      ticketId,
    });
  });
};

export default UpdateDeletedUserOpenTicketsStatus;

import { messages as Message, PrismaClient } from "@prisma/client";
import { getIO } from "../../libs/socket";

interface MessageData {
  id: string;
  ticketId: number;
  body: string;
  contactId?: number;
  fromMe?: boolean;
  read?: boolean;
  mediaType?: string;
  mediaUrl?: string;
}
interface Request {
  messageData: MessageData;
}

const prisma = new PrismaClient();

const CreateMessageService = async ({
  messageData,
}: Request): Promise<Message> => {
  await prisma.messages.upsert({
    where: { id: messageData.id },
    update: messageData,
    create: messageData,
  });

  const message = await prisma.messages.findUnique({
    where: { id: messageData.id },
    include: {
      contacts: true,
      messages: {
        include: { contacts: true },
      },
      tickets: {
        include: {
          contacts: true,
          queues: {
            include: {
              whatsapps: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!message) {
    throw new Error("ERR_CREATING_MESSAGE");
  }

  const io = getIO();
  io.to(message.ticketId.toString())
    .to(message.tickets.status)
    .to("notification")
    .emit("appMessage", {
      action: "create",
      message,
      ticket: message.tickets,
      contact: message.tickets.contacts,
    });

  return message;
};

export default CreateMessageService;

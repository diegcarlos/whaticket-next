import { messages as Message, PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";
import GetWbotMessage from "../../helpers/GetWbotMessage";

const DeleteWhatsAppMessage = async (messageId: string): Promise<Message> => {
  const prisma = new PrismaClient();
  const message = await prisma.messages.findUnique({
    where: { id: messageId },
    include: { tickets: true, contacts: true },
  });

  if (!message) {
    throw new AppError("No message found with this ID.");
  }

  const { tickets } = message;

  const messageToDelete = await GetWbotMessage(tickets, messageId);

  try {
    await messageToDelete.delete(true);
  } catch (err) {
    throw new AppError("ERR_DELETE_WAPP_MSG");
  }
  await prisma.messages.update({
    where: { id: message.id },
    data: { isDeleted: true },
  });

  return message;
};

export default DeleteWhatsAppMessage;

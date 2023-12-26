import { PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

const prisma = new PrismaClient();

const DeleteQuickAnswerService = async (id: number): Promise<void> => {
  const quickAnswer = await prisma.quickanswers.findUnique({
    where: { id },
  });

  if (!quickAnswer) {
    throw new AppError("ERR_NO_QUICK_ANSWER_FOUND", 404);
  }

  await prisma.quickanswers.delete({ where: { id: quickAnswer.id } });
};

export default DeleteQuickAnswerService;

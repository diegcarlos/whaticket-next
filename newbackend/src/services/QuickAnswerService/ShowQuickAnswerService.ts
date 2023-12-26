import { PrismaClient, quickanswers as QuickAnswer } from "@prisma/client";
import AppError from "../../errors/AppError";

const prisma = new PrismaClient();

const ShowQuickAnswerService = async (id: number): Promise<QuickAnswer> => {
  const quickAnswer = await prisma.quickanswers.findUnique({ where: { id } });

  if (!quickAnswer) {
    throw new AppError("ERR_NO_QUICK_ANSWERS_FOUND", 404);
  }

  return quickAnswer;
};

export default ShowQuickAnswerService;

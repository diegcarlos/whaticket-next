import { PrismaClient, quickanswers as QuickAnswer } from "@prisma/client";
import AppError from "../../errors/AppError";

interface Request {
  shortcut: string;
  message: string;
}
const prisma = new PrismaClient();

const CreateQuickAnswerService = async ({
  shortcut,
  message,
}: Request): Promise<QuickAnswer> => {
  const nameExists = await prisma.quickanswers.findFirst({
    where: { shortcut },
  });

  if (nameExists) {
    throw new AppError("ERR__SHORTCUT_DUPLICATED");
  }

  const quickAnswer = await prisma.quickanswers.create({
    data: { shortcut, message },
  });

  return quickAnswer;
};

export default CreateQuickAnswerService;

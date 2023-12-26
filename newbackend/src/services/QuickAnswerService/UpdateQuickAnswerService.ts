import { PrismaClient, quickanswers as QuickAnswer } from "@prisma/client";
import AppError from "../../errors/AppError";

interface QuickAnswerData {
  shortcut?: string;
  message?: string;
}

interface Request {
  quickAnswerData: QuickAnswerData;
  quickAnswerId: number;
}

const prisma = new PrismaClient();

async function getQuickAnswer(id: number) {
  return await prisma.quickanswers.findUnique({
    where: { id },
    select: {
      id: true,
      shortcut: true,
      message: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

const UpdateQuickAnswerService = async ({
  quickAnswerData,
  quickAnswerId,
}: Request): Promise<QuickAnswer | null> => {
  const { shortcut, message } = quickAnswerData;

  let quickAnswer = await getQuickAnswer(quickAnswerId);

  if (!quickAnswer) {
    throw new AppError("ERR_NO_QUICK_ANSWERS_FOUND", 404);
  }
  const up = await prisma.quickanswers.update({
    where: { id: quickAnswer.id },
    data: { shortcut, message },
  });

  quickAnswer = await getQuickAnswer(up.id);

  return quickAnswer;
};

export default UpdateQuickAnswerService;

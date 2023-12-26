import { PrismaClient, quickanswers as QuickAnswer } from "@prisma/client";

interface Request {
  searchParam?: string;
  pageNumber?: string;
}

interface Response {
  quickAnswers: QuickAnswer[];
  count: number;
  hasMore: boolean;
}

const prisma = new PrismaClient();

const ListQuickAnswerService = async ({
  searchParam = "",
  pageNumber = "1",
}: Request): Promise<Response> => {
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const count = await prisma.quickanswers.count();

  const result = await prisma.quickanswers.findMany({
    where: {
      message: {
        contains: searchParam.toLowerCase().trim(),
      },
    },
    take: limit,
    skip: offset,
    orderBy: { message: "asc" },
  });

  const hasMore = count > offset + result.length;

  return {
    quickAnswers: result,
    count,
    hasMore,
  };
};

export default ListQuickAnswerService;

import { PrismaClient } from "@prisma/client";
import { UserReturn } from "./ShowUserService";

interface Request {
  searchParam?: string;
  pageNumber?: string | number;
}

interface Response {
  users: UserReturn[];
  count: number;
  hasMore: boolean;
}

const prisma = new PrismaClient();

const ListUsersService = async ({
  searchParam = "",
  pageNumber = "1",
}: Request): Promise<Response> => {
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const users = await prisma.users.findMany({
    where: {
      OR: [
        { name: { contains: searchParam.toLocaleLowerCase() } },
        { email: { contains: searchParam.toLocaleLowerCase() } },
      ],
    },
    select: {
      name: true,
      id: true,
      email: true,
      profile: true,
      createdAt: true,
      queues: { include: { queues: true } },
      whatsapps: { select: { id: true, name: true } },
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
  });

  const count = await prisma.users.count();

  const hasMore = count > offset + users.length;

  return {
    users,
    count,
    hasMore,
  };
};

export default ListUsersService;

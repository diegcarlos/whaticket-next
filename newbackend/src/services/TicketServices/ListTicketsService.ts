import { Prisma, PrismaClient, tickets as Ticket } from "@prisma/client";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import ShowUserService from "../UserService/ShowUserService";

interface Request {
  searchParam?: string;
  pageNumber?: string;
  status?: string;
  date?: string;
  showAll?: string;
  userId: number;
  withUnreadMessages?: string;
  queueIds: number[] | null;
}

interface Response {
  tickets: Ticket[];
  count: number;
  hasMore: boolean;
}

const prisma = new PrismaClient();

const ListTicketsService = async ({
  searchParam = "",
  pageNumber = "1",
  queueIds = [],
  status,
  date,
  showAll,
  userId,
  withUnreadMessages,
}: Request): Promise<Response> => {
  let whereCondition: Prisma.ticketsFindManyArgs["where"] = {
    OR: [
      { userId },
      { status: "pending" },
      { queueId: { in: queueIds } },
      { queueId: null },
    ],
  };

  let includeCondition: Prisma.ticketsFindManyArgs["include"];

  includeCondition = {
    contacts: { select: { id: true, name: true, profilePicUrl: true } },
    queues: { select: { id: true, name: true, color: true } },
    whatsapps: { select: { name: true } },
  };

  if (showAll === "true") {
    whereCondition = { OR: [{ queueId: { in: queueIds } }, { queueId: null }] };
  }

  if (status) {
    whereCondition = {
      ...whereCondition,
      status,
    };
  }

  if (searchParam) {
    const sanitizedSearchParam = searchParam.toLocaleLowerCase().trim();

    includeCondition = {
      ...includeCondition,
      messages: {
        where: { body: { contains: sanitizedSearchParam } },
        select: { id: true, body: true },
      },
    };

    whereCondition = {
      ...whereCondition,
      OR: [
        {
          contacts: {
            name: {
              contains: sanitizedSearchParam.toLowerCase(),
            },
          },
        },
        {
          contacts: {
            number: {
              contains: sanitizedSearchParam,
            },
          },
        },
        {
          messages: {
            some: {
              body: {
                contains: sanitizedSearchParam.toLowerCase(),
              },
            },
          },
        },
      ],
    };
  }

  if (date) {
    whereCondition = {
      createdAt: {
        gte: new Date(startOfDay(parseISO(date))),
        lte: new Date(endOfDay(parseISO(date))),
      },
    };
  }

  if (withUnreadMessages === "true") {
    const user = await ShowUserService(userId);
    const userQueueIds = user.queues.map((queue) => queue.id);

    whereCondition = {
      OR: [
        { userId },
        { status: "pending" },
        { queueId: { in: userQueueIds } },
        { queueId: null },
      ],
      unreadMessages: { gt: 0 },
    };
  }

  const limit = 40;
  const offset = limit * (+pageNumber - 1);

  const count = await prisma.tickets.count();

  const rows = await prisma.tickets.findMany({
    where: whereCondition,
    include: includeCondition,
    take: limit,
    skip: offset,
    distinct: "id",
    orderBy: { updatedAt: "desc" },
  });

  const hasMore = count > offset + rows.length;

  return {
    tickets: rows,
    count,
    hasMore,
  };
};

export default ListTicketsService;

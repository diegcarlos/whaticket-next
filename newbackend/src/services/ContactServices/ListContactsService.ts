import { contacts as Contact, PrismaClient } from "@prisma/client";

interface Request {
  searchParam?: string;
  pageNumber?: string;
}

interface Response {
  contacts: Contact[];
  count: number;
  hasMore: boolean;
}

const prisma = new PrismaClient();

const ListContactsService = async ({
  searchParam = "",
  pageNumber = "1",
}: Request): Promise<Response> => {
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const count = await prisma.contacts.count();

  const contacts = await prisma.contacts.findMany({
    where: {
      OR: [
        { name: { contains: searchParam.toLowerCase().trim() } },
        { number: { contains: searchParam.toLowerCase().trim() } },
      ],
    },
    take: limit,
    skip: offset,
    orderBy: { name: "asc" },
  });

  const hasMore = count > offset + contacts.length;

  return {
    contacts,
    count,
    hasMore,
  };
};

export default ListContactsService;

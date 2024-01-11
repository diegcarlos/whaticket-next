import { PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

export interface UserReturn {
  name?: string;
  id?: number;
  email?: string;
  profile?: string;
  tokenVersion?: number;
  queues?: { id: number; name: string; color: string }[];
  whatsapps?: { id: number; name: string } | null;
}

const prisma = new PrismaClient();

const ShowUserService = async (id: number): Promise<UserReturn> => {
  let user = await prisma.users.findUnique({
    where: { id },
    select: {
      name: true,
      id: true,
      email: true,
      profile: true,
      tokenVersion: true,
      whatsappId: true,
      userqueues: {
        select: {
          queues: {
            select: { id: true, name: true, color: true },
          },
        },
      },
      whatsapps: { select: { id: true, name: true } },
    },
  });

  const queues = {
    ...user,
    queues: user?.userqueues.map((uq) => {
      uq.queues;
      return { ...uq.queues };
    }),
  };

  delete queues["userqueues"];

  if (!user) {
    throw new AppError("ERR_NO_USER_FOUND", 404);
  }

  return queues;
};

export default ShowUserService;

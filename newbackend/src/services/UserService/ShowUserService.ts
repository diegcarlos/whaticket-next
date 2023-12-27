import { PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

export interface UserReturn {
  name: string;
  id: number;
  email: string;
  profile: string;
  tokenVersion?: number;
  queues: { id: number; name: string; color: string }[];
  whatsapps: { id: number; name: string } | null;
}

const prisma = new PrismaClient();

const ShowUserService = async (id: number): Promise<UserReturn> => {
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      name: true,
      id: true,
      email: true,
      profile: true,
      tokenVersion: true,
      whatsappId: true,
      queues: {
        select: { id: true, name: true, color: true },
        orderBy: { name: "asc" },
      },
      whatsapps: { select: { id: true, name: true } },
    },
  });
  if (!user) {
    throw new AppError("ERR_NO_USER_FOUND", 404);
  }

  return user;
};

export default ShowUserService;

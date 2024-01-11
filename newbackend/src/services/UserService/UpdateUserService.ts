import * as Yup from "yup";

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { difference } from "lodash";
import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import { logger } from "../../util/logger";
import ShowUserService from "./ShowUserService";

interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profile?: string;
  queueIds?: number[];
  whatsappId?: number;
}

interface Request {
  userData: UserData;
  userId: number;
}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
}

const prisma = new PrismaClient();

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 8);
};

const UpdateUserService = async ({
  userData,
  userId,
}: Request): Promise<Response | undefined> => {
  const user = await ShowUserService(userId);

  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    email: Yup.string().email(),
    profile: Yup.string(),
    password: Yup.string(),
  });

  const {
    email,
    password,
    profile,
    name,
    queueIds = [],
    whatsappId,
  } = userData;

  try {
    await schema.validate({ email, password, profile, name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const passwordHash = await hashPassword(password as any);

  await prisma.users.update({
    where: { id: user.id },
    data: {
      email,
      passwordHash,
      profile,
      name,
      whatsappId: whatsappId ? whatsappId : null,
    },
  });

  if (queueIds.length > 0) {
    const userQueues = await prisma.userqueues.findMany({ where: { userId } });
    const exitsQueueId = userQueues.map((q) => q.queueId);
    const newQue = difference(queueIds, exitsQueueId);
    const delQue = difference(exitsQueueId, queueIds);

    await prisma.userqueues.deleteMany({
      where: { queueId: { in: delQue }, userId },
    });

    logger.warn(`new ${newQue}`);
    logger.warn(`del ${delQue}`);

    await prisma.userqueues.createMany({
      data: newQue.map((q) => {
        return { queueId: q, userId: userId };
      }),
      skipDuplicates: true,
    });
  }

  const reloadUser = await prisma.users.findUnique({
    where: { id: user.id },
    include: { whatsapps: true, userqueues: { include: { queues: true } } },
  });

  return SerializeUser(reloadUser as any);
};

export default UpdateUserService;

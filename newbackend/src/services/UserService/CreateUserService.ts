import * as Yup from "yup";

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";

interface Request {
  email: string;
  password: string;
  name: string;
  queueIds?: number[];
  profile?: string;
  whatsappId?: number;
}

interface Response {
  email: string;
  name: string;
  id: number;
  profile: string;
}

const prisma = new PrismaClient();

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 8);
};

const CreateUserService = async ({
  email,
  password,
  name,
  queueIds = [],
  profile = "admin",
  whatsappId,
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
    email: Yup.string()
      .email()
      .required()
      .test(
        "Check-email",
        "An user with this email already exists.",
        async (value) => {
          if (!value) return false;
          const emailExists = await prisma.users.findFirst({
            where: { email: value },
          });
          return !emailExists;
        }
      ),
    password: Yup.string().required().min(5),
  });

  try {
    await schema.validate({ email, password, name });
  } catch (err: any) {
    throw new AppError(err.message);
  }
  const passwordHash = await hashPassword(password);

  let user = await prisma.users.create({
    data: {
      email,
      passwordHash,
      name,
      profile,
      whatsappId: whatsappId ? whatsappId : null,
    },
    include: { queues: true, whatsapps: true },
  });

  await prisma.userqueues.createMany({
    data: queueIds.map((q) => {
      return { queueId: q, userId: user.id };
    }),
  });

  const reloadUser = await prisma.users.findUnique({
    where: { id: user.id },
    include: { queues: true, whatsapps: true },
  });

  return SerializeUser(reloadUser as any);
};

export default CreateUserService;

import { PrismaClient, queues as Queues } from "@prisma/client";
import { compare } from "bcryptjs";
import AppError from "../../errors/AppError";
import {
  createAccessToken,
  createRefreshToken,
} from "../../helpers/CreateTokens";
import { SerializeUser } from "../../helpers/SerializeUser";
interface SerializedUser {
  id?: number;
  name?: string;
  email?: string;
  profile?: string;
  queues: Queues[];
}

interface Response {
  serializedUser: SerializedUser;
  token: string;
  refreshToken: string;
}
interface Request {
  email: string;
  password: string;
}

const checkPassword = (sendPassword: string, password: string) => {
  return compare(sendPassword, password);
};

const AuthUserService = async (props: Request): Promise<Response> => {
  const { email, password } = props;
  const prisma = new PrismaClient();

  const user = await prisma.users.findUnique({ where: { email } });
  const queues = await prisma.queues.findMany({ include: { whatsapps: true } });

  if (!user) {
    throw new AppError("ERR_INVALID_CREDENTIALS", 401);
  }

  if (!checkPassword(password, user.passwordHash)) {
    throw new AppError("ERR_INVALID_CREDENTIALS", 401);
  }

  const token = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const serializedUser = SerializeUser({ ...user, queues });

  return {
    refreshToken,
    token,
    serializedUser,
  };
};

export default AuthUserService;

import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../errors/AppError";
import { SendRefreshToken } from "../helpers/SendRefreshToken";
import { RefreshTokenService } from "../services/AuthServices/RefreshTokenService";
import AuthUserService from "../services/UserService/AuthUserService";

export const store = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password }: any = req.body;

  const { token, serializedUser, refreshToken } = await AuthUserService({
    email,
    password,
  });

  SendRefreshToken(reply, refreshToken);
  return reply.send({
    token,
    user: serializedUser,
  });
};

export const update = async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<FastifyRequest> => {
  const token: string | undefined = req.cookies.jrt;

  if (!token) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const { user, newToken, refreshToken } = await RefreshTokenService(
    res,
    token
  );

  SendRefreshToken(res, refreshToken);

  return res.send({ token: newToken, user });
};

export const remove = async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<FastifyRequest> => {
  res.clearCookie("jrt");

  return res.send();
};

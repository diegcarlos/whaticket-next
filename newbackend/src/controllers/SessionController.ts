import { FastifyReply, FastifyRequest } from "fastify";
import { SendRefreshToken } from "../helpers/SendRefreshToken";
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

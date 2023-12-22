import { FastifyReply } from "fastify";

export const SendRefreshToken = (reply: FastifyReply, token: string): void => {
  reply.cookie("jrt", token, { httpOnly: true });
};

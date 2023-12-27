import { users as User } from "@prisma/client";
import { FastifyReply as Res } from "fastify";
import { verify } from "jsonwebtoken";
import ShowUserService from "../UserService/ShowUserService";

import authConfig from "../../config/auth";
import AppError from "../../errors/AppError";
import {
  createAccessToken,
  createRefreshToken,
} from "../../helpers/CreateTokens";

interface RefreshTokenPayload {
  id: number;
  tokenVersion: number;
}

interface Response {
  user: User;
  newToken: string;
  refreshToken: string;
}

export const RefreshTokenService = async (
  res: Res,
  token: string
): Promise<Response> => {
  try {
    const decoded = verify(token, authConfig.refreshSecret);
    const { id, tokenVersion } = decoded as RefreshTokenPayload;

    const user = (await ShowUserService(id)) as any;

    if (user.tokenVersion !== tokenVersion) {
      res.clearCookie("jrt");
      throw new AppError("ERR_SESSION_EXPIRED", 401);
    }

    const newToken = createAccessToken(user as any);
    const refreshToken = createRefreshToken(user as any);

    return { user, newToken, refreshToken };
  } catch (err) {
    res.clearCookie("jrt");
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }
};

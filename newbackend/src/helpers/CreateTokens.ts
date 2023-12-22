import { users as User } from "@prisma/client";
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";

export const createAccessToken = (user: User): string => {
  const { secret, expiresIn } = authConfig;

  return sign(
    { usarname: user.name, profile: user.profile, id: user.id },
    secret,
    {
      expiresIn,
    }
  );
};

export const createRefreshToken = (user: User): string => {
  const { refreshSecret, refreshExpiresIn } = authConfig;

  return sign({ id: user.id, tokenVersion: user.tokenVersion }, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });
};

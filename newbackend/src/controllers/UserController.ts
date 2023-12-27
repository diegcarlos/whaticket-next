import { FastifyRequest as Request, FastifyReply as Response } from "fastify";
import { getIO } from "../libs/socket";

import AppError from "../errors/AppError";
import CheckSettingsHelper from "../helpers/CheckSettings";
import CreateUserService from "../services/UserService/CreateUserService";
import DeleteUserService from "../services/UserService/DeleteUserService";
import ListUsersService from "../services/UserService/ListUsersService";
import ShowUserService from "../services/UserService/ShowUserService";
import UpdateUserService from "../services/UserService/UpdateUserService";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

export const index = async (
  req: Request | any,
  res: Response
): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;

  const { users, count, hasMore } = await ListUsersService({
    searchParam,
    pageNumber,
  });

  return res.send({ users, count, hasMore });
};

export const store = async (
  req: Request | any,
  res: Response
): Promise<Response> => {
  const { email, password, name, profile, queueIds, whatsappId }: any =
    req.body;

  if (
    req.url === "/signup" &&
    (await CheckSettingsHelper("userCreation")) === "disabled"
  ) {
    throw new AppError("ERR_USER_CREATION_DISABLED", 403);
  } else if (req.url !== "/signup" && req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const user = await CreateUserService({
    email,
    password,
    name,
    profile,
    queueIds,
    whatsappId,
  });

  const io = getIO();
  io.emit("user", {
    action: "create",
    user,
  });

  return res.send(user);
};

export const show = async (
  req: Request | any,
  res: Response
): Promise<Response> => {
  const { userId }: any = req.params;

  const user = await ShowUserService(userId);

  return res.send(user);
};

export const update = async (
  req: Request | any,
  res: Response
): Promise<Response> => {
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const { userId }: any = req.params;
  const userData = req.body;

  const user = await UpdateUserService({ userData, userId });

  const io = getIO();
  io.emit("user", {
    action: "update",
    user,
  });

  return res.send(user);
};

export const remove = async (
  req: Request | any,
  res: Response
): Promise<Response> => {
  const { userId }: any = req.params;

  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  await DeleteUserService(userId);

  const io = getIO();
  io.emit("user", {
    action: "delete",
    userId,
  });

  return res.send({ message: "User deleted" });
};

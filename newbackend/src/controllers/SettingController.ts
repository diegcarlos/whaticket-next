import { FastifyRequest as Request, FastifyReply as Response } from "fastify";

import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";

import ListSettingsService from "../services/SettingServices/ListSettingsService";
import UpdateSettingService from "../services/SettingServices/UpdateSettingService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  //@ts-ignore
  const { profile }: any = req.user;
  if (profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const settings = await ListSettingsService();

  return res.code(200).send(settings);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { profile }: any = req;
  if (profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  const { settingKey: key }: any = req.params;
  const { value }: any = req.body;

  const setting = await UpdateSettingService({
    key,
    value,
  });

  const io = getIO();
  io.emit("settings", {
    action: "update",
    setting,
  });

  return res.code(200).send(setting);
};

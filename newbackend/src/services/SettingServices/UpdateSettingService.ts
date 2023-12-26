import { PrismaClient, settings as Setting } from "@prisma/client";
import AppError from "../../errors/AppError";

interface Request {
  key: string;
  value: string;
}

const prisma = new PrismaClient();

const UpdateSettingService = async ({
  key,
  value,
}: Request): Promise<Setting | undefined> => {
  const setting = await prisma.settings.findFirst({
    where: { key },
  });

  if (!setting) {
    throw new AppError("ERR_NO_SETTING_FOUND", 404);
  }
  await prisma.settings.update({
    where: { key: setting.key },
    data: { value },
  });
  return setting;
};

export default UpdateSettingService;

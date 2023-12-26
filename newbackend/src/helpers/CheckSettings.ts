import { PrismaClient } from "@prisma/client";
import AppError from "../errors/AppError";

const prisma = new PrismaClient();

const CheckSettings = async (key: string): Promise<string> => {
  const setting = await prisma.settings.findFirst({
    where: { key },
  });

  if (!setting) {
    throw new AppError("ERR_NO_SETTING_FOUND", 404);
  }

  return setting.value;
};

export default CheckSettings;

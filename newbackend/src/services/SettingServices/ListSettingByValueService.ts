import { PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

interface Response {
  key: string;
  value: string;
}

const prisma = new PrismaClient();

const ListSettingByKeyService = async (
  value: string
): Promise<Response | undefined> => {
  const settings = await prisma.settings.findFirst({
    where: { value },
  });

  if (!settings) {
    throw new AppError("ERR_NO_API_TOKEN_FOUND", 404);
  }

  return { key: settings.key, value: settings.value };
};

export default ListSettingByKeyService;

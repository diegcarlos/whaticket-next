import { PrismaClient, settings as Setting } from "@prisma/client";

const prisma = new PrismaClient();

const ListSettingsService = async (): Promise<Setting[] | undefined> => {
  const settings = await prisma.settings.findMany();

  return settings;
};

export default ListSettingsService;

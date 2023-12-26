import * as Yup from "yup";

import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";
import AppError from "../../errors/AppError";
import AssociateWhatsappQueue from "./AssociateWhatsappQueue";
import ShowWhatsAppService from "./ShowWhatsAppService";

interface WhatsappData {
  name?: string;
  status?: string;
  session?: string;
  isDefault?: boolean;
  greetingMessage?: string;
  farewellMessage?: string;
  queueIds?: number[];
}

interface Request {
  whatsappData: WhatsappData;
  whatsappId: string;
}

interface Response {
  whatsapp: Whatsapp;
  oldDefaultWhatsapp: Whatsapp | null;
}

const prisma = new PrismaClient();

const UpdateWhatsAppService = async ({
  whatsappData,
  whatsappId,
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    status: Yup.string(),
    isDefault: Yup.boolean(),
  });

  const {
    name,
    status,
    isDefault,
    session,
    greetingMessage,
    farewellMessage,
    queueIds = [],
  } = whatsappData;

  try {
    await schema.validate({ name, status, isDefault });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  if (queueIds.length > 1 && !greetingMessage) {
    throw new AppError("ERR_WAPP_GREETING_REQUIRED");
  }

  let oldDefaultWhatsapp: Whatsapp | null = null;

  if (isDefault) {
    oldDefaultWhatsapp = await prisma.whatsapps.findFirst({
      where: { isDefault: true, id: { not: Number(whatsappId) } },
    });
    if (oldDefaultWhatsapp) {
      await prisma.whatsapps.update({
        data: { isDefault: false },
        where: { id: oldDefaultWhatsapp.id },
      });
    }
  }

  const whatsapp = await ShowWhatsAppService(whatsappId);

  await prisma.whatsapps.update({
    where: { id: whatsapp.id },
    data: {
      name,
      status,
      session,
      greetingMessage,
      farewellMessage,
      isDefault,
    },
  });

  await AssociateWhatsappQueue(whatsapp, queueIds);

  return { whatsapp, oldDefaultWhatsapp };
};

export default UpdateWhatsAppService;

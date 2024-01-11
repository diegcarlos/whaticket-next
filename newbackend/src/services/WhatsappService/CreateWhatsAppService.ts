import * as Yup from "yup";

import { PrismaClient, whatsapps as Whatsapp } from "@prisma/client";
import AppError from "../../errors/AppError";
import AssociateWhatsappQueue from "./AssociateWhatsappQueue";

interface Request {
  name: string;
  queueIds?: number[];
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
}

interface Response {
  whatsapp: Whatsapp;
  oldDefaultWhatsapp: Whatsapp | null;
}

const prisma = new PrismaClient();

const CreateWhatsAppService = async ({
  name,
  status = "OPENING",
  queueIds = [],
  greetingMessage,
  farewellMessage,
  isDefault = false,
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required()
      .min(2)
      .test(
        "Check-name",
        "This whatsapp name is already used.",
        async (value) => {
          if (!value) return false;
          const nameExists = await prisma.whatsapps.findFirst({
            where: { name: value },
          });
          return !nameExists;
        }
      ),
    isDefault: Yup.boolean().required(),
  });

  try {
    await schema.validate({ name, status, isDefault });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const whatsappFound = await prisma.whatsapps.findFirst();

  isDefault = !whatsappFound;

  let oldDefaultWhatsapp: Whatsapp | null = null;

  if (isDefault) {
    oldDefaultWhatsapp = await prisma.whatsapps.findFirst({
      where: { isDefault: true },
    });
    if (oldDefaultWhatsapp) {
      await prisma.whatsapps.update({
        data: { isDefault: false },
        where: { id: oldDefaultWhatsapp.id },
      });
    }
  }

  if (queueIds.length > 1 && !greetingMessage) {
    throw new AppError("ERR_WAPP_GREETING_REQUIRED");
  }

  let whatsapp: any = await prisma.whatsapps.create({
    data: { name, status, greetingMessage, farewellMessage, isDefault },
    include: { whatsappqueues: { include: { queues: true } } },
  });

  whatsapp = {
    ...whatsapp,
    queues: {
      ...whatsapp.whatsappqueues.map((w: any) => {
        return { ...w.queues };
      }),
    },
  };
  delete whatsapp["whatsappqueues"];

  await AssociateWhatsappQueue(whatsapp, queueIds);

  return { whatsapp, oldDefaultWhatsapp };
};

export default CreateWhatsAppService;

import { FastifyReply, FastifyRequest } from "fastify";
import { getIO } from "../libs/socket";
import { removeWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";

import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import ListWhatsAppsService from "../services/WhatsappService/ListWhatsAppsService";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";

interface WhatsappData {
  name: string;
  queueIds: number[];
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
}

export const index = async (
  req: FastifyRequest,
  resply: FastifyReply
): Promise<FastifyReply> => {
  const whatsapps = await ListWhatsAppsService();

  return resply.send(whatsapps);
};

export const store = async (
  req: FastifyRequest,
  resply: FastifyReply
): Promise<FastifyReply> => {
  const {
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds,
  }: WhatsappData = req.body as any;

  const { whatsapp, oldDefaultWhatsapp } = await CreateWhatsAppService({
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds,
  });

  StartWhatsAppSession(whatsapp);

  const io = getIO();
  io.emit("whatsapp", {
    action: "update",
    whatsapp,
  });

  if (oldDefaultWhatsapp) {
    io.emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp,
    });
  }

  return resply.send(whatsapp);
};

export const show = async (
  req: FastifyRequest,
  resply: FastifyReply
): Promise<FastifyReply> => {
  const { whatsappId }: any = req.params;

  const whatsapp = await ShowWhatsAppService(whatsappId);

  return resply.send(whatsapp);
};

export const update = async (
  req: FastifyRequest,
  resply: FastifyReply
): Promise<FastifyReply> => {
  const { whatsappId }: any = req.params;
  const whatsappData: any = req.body;

  const { whatsapp, oldDefaultWhatsapp } = await UpdateWhatsAppService({
    whatsappData,
    whatsappId,
  });

  const io = getIO();
  io.emit("whatsapp", {
    action: "update",
    whatsapp,
  });

  if (oldDefaultWhatsapp) {
    io.emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp,
    });
  }

  return resply.send(whatsapp);
};

export const remove = async (
  req: FastifyRequest,
  resply: FastifyReply
): Promise<FastifyReply> => {
  const { whatsappId }: any = req.params;

  await DeleteWhatsAppService(whatsappId);
  removeWbot(+whatsappId);

  const io = getIO();
  io.emit("whatsapp", {
    action: "delete",
    whatsappId: +whatsappId,
  });

  return resply.send({ message: "Whatsapp deleted." });
};

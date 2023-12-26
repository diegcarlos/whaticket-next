import { FastifyReply, FastifyRequest } from "fastify";
import { getWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";

const store = async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<Response> => {
  const { whatsappId }: any = req.params;
  const whatsapp = await ShowWhatsAppService(whatsappId);

  StartWhatsAppSession(whatsapp);

  return res.send({ message: "Starting session" });
};

const update = async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<Response> => {
  const { whatsappId }: any = req.params;

  const { whatsapp } = await UpdateWhatsAppService({
    whatsappId,
    whatsappData: { session: "" },
  });

  StartWhatsAppSession(whatsapp);

  return res.send({ message: "Starting session." });
};

const remove = async (
  req: FastifyRequest,
  res: FastifyReply
): Promise<Response> => {
  const { whatsappId }: any = req.params;
  const whatsapp = await ShowWhatsAppService(whatsappId);

  const wbot = getWbot(whatsapp.id);

  wbot.logout();

  return res.send({ message: "Session disconnected." });
};

export { remove, store, update };

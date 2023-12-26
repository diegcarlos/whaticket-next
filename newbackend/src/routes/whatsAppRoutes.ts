import { FastifyInstance } from "fastify";
import * as WhatsAppController from "../controllers/WhatsAppController";
import isAuth from "../middleware/isAuth";

const authRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/whatsapp",
    handler: WhatsAppController.index,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/whatsapp",
    handler: WhatsAppController.store,
    preHandler: isAuth,
  });

  fastify.route({
    method: "GET",
    url: "/whatsapp/:whatsappId",
    handler: WhatsAppController.show,
    preHandler: isAuth,
  });

  fastify.route({
    method: "PUT",
    url: "/whatsapp/:whatsappId",
    handler: WhatsAppController.update,
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/whatsapp/:whatsappId",
    handler: WhatsAppController.remove,
    preHandler: isAuth,
  });
};

export default authRoutes;

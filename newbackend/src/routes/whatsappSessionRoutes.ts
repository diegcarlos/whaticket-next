import isAuth from "../middleware/isAuth";

import { FastifyInstance } from "fastify";

import * as WhatsAppSessionController from "../controllers/WhatsAppSessionController";

export default async function whatsAppSessionRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.route({
    method: "POST",
    url: "/whatsappsession/:whatsappId",
    handler: WhatsAppSessionController.store,
    preHandler: isAuth,
  });

  fastify.route({
    method: "PUT",
    url: "/whatsappsession/:whatsappId",
    handler: WhatsAppSessionController.update,
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/whatsappsession/:whatsappId",
    handler: WhatsAppSessionController.remove,
    preHandler: isAuth,
  });
}

import { FastifyInstance } from "fastify";
import * as TicketController from "../controllers/TicketController";
import isAuth from "../middleware/isAuth";

const ticketRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/tickets",
    handler: TicketController.index,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/tickets",
    handler: TicketController.store,
    preHandler: isAuth,
  });

  fastify.route({
    method: "GET",
    url: "/tickets/:ticketsId",
    handler: TicketController.show,
    preHandler: isAuth,
  });

  fastify.route({
    method: "PUT",
    url: "/tickets/:ticketsId",
    handler: TicketController.update,
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/tickets/:ticketsId",
    handler: TicketController.remove,
    preHandler: isAuth,
  });
};

export default ticketRoutes;

import { FastifyInstance } from "fastify";
import * as QueueController from "../controllers/QueueController";
import isAuth from "../middleware/isAuth";

const queueRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/queue",
    handler: QueueController.index,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/queue",
    handler: QueueController.store,
    preHandler: isAuth,
  });

  fastify.route({
    method: "GET",
    url: "/queue/:queueId",
    handler: QueueController.show,
    preHandler: isAuth,
  });

  fastify.route({
    method: "PUT",
    url: "/queue/:queueId",
    handler: QueueController.update,
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/queue/:queueId",
    handler: QueueController.remove,
    preHandler: isAuth,
  });
};

export default queueRoutes;

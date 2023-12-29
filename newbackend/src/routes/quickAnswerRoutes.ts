import { FastifyInstance } from "fastify";
import * as QuickAnswerController from "../controllers/QuickAnswerController";
import isAuth from "../middleware/isAuth";

const quickAnswerRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/quickAnswers",
    handler: QuickAnswerController.index,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/quickAnswers",
    handler: QuickAnswerController.store,
    preHandler: isAuth,
  });

  fastify.route({
    method: "GET",
    url: "/quickAnswers/:quickAnswerId",
    handler: QuickAnswerController.show,
    preHandler: isAuth,
  });

  fastify.route({
    method: "PUT",
    url: "/quickAnswers/:quickAnswerId",
    handler: QuickAnswerController.update,
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/quickAnswers/:quickAnswerId",
    handler: QuickAnswerController.remove,
    preHandler: isAuth,
  });
};

export default quickAnswerRoutes;

import { FastifyInstance } from "fastify";
import * as ContactController from "../controllers/ContactController";
import isAuth from "../middleware/isAuth";

const contactRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/contacts",
    handler: ContactController.index,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/contacts",
    handler: ContactController.store,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/contact",
    handler: ContactController.getContact,
    preHandler: isAuth,
  });

  fastify.route({
    method: "GET",
    url: "/contacts/:contactId",
    handler: ContactController.show,
    preHandler: isAuth,
  });

  fastify.route({
    method: "PUT",
    url: "/contacts/:contactId",
    handler: ContactController.update,
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/contacts/:contactId",
    handler: ContactController.remove,
    preHandler: isAuth,
  });
};

export default contactRoutes;

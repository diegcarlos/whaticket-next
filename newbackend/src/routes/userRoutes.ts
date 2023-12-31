import { FastifyInstance } from "fastify";
import * as UserController from "../controllers/UserController";
import isAuth from "../middleware/isAuth";

const userRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/users",
    handler: UserController.index,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/users",
    handler: UserController.store,
    preHandler: isAuth,
  });

  fastify.route({
    method: "GET",
    url: "/users/:userId",
    handler: UserController.show,
    preHandler: isAuth,
  });

  fastify.route({
    method: "PUT",
    url: "/users/:userId",
    handler: UserController.update,
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/users/:userId",
    handler: UserController.remove,
    preHandler: isAuth,
  });
};

export default userRoutes;

import { FastifyInstance } from "fastify";
import * as SessionController from "../controllers/SessionController";
import * as UserController from "../controllers/UserController";

const authRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.post("/signup", UserController.store);

  fastify.post("/login", SessionController.store);

  fastify.post("/refresh_token", SessionController.update);

  fastify.delete("/logout", SessionController.remove);
};

export default authRoutes;

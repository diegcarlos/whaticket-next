import { FastifyInstance } from "fastify";
import * as SessionController from "../controllers/SessionController";

const authRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.post("/signup", (req, reply) => {});

  fastify.post("/login", SessionController.store);

  fastify.post("/refresh_token", (req, reply) => {});

  fastify.delete("/logout", (req, reply) => {});
};

export default authRoutes;

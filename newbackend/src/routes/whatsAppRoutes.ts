import { FastifyInstance } from "fastify";
import * as WhatsAppController from "../controllers/WhatsAppController";

const authRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.post("/signup", (req, reply) => {});

  fastify.post("/login", WhatsAppController.store);

  fastify.post("/refresh_token", (req, reply) => {});

  fastify.delete("/logout", (req, reply) => {});
};

export default authRoutes;

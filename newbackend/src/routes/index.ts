import fp from "fastify-plugin";
import { FastifyInstance } from "fastify/types/instance";
import authRoutes from "./authRoutes";
import whatsAppRoutes from "./whatsAppRoutes";

const routes = async (f: FastifyInstance, opts: any) => {
  f.register(authRoutes, { prefix: "/auth" });
  f.register(whatsAppRoutes);
};

export default fp(routes);

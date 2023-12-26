import fp from "fastify-plugin";
import { FastifyInstance } from "fastify/types/instance";
import authRoutes from "./authRoutes";
import whatsAppRoutes from "./whatsAppRoutes";
import whatsAppSessionRoutes from "./whatsappSessionRoutes";

const routes = async (f: FastifyInstance, opts: any) => {
  f.register(authRoutes, { prefix: "/auth" });
  f.register(whatsAppRoutes);
  f.register(whatsAppSessionRoutes);
};

export default fp(routes);

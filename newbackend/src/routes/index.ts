import fp from "fastify-plugin";
import { FastifyInstance } from "fastify/types/instance";
import authRoutes from "./authRoutes";
import contactRoutes from "./contactRoutes";
import messageRoutes from "./messageRoutes";
import queueRoutes from "./queueRoutes";
import quickAnswerRoutes from "./quickAnswerRoutes";
import settingRoutes from "./settingRoutes";
import ticketRoutes from "./ticketRoutes";
import userRoutes from "./userRoutes";
import whatsAppRoutes from "./whatsAppRoutes";
import whatsAppSessionRoutes from "./whatsappSessionRoutes";

const routes = async (f: FastifyInstance, opts: any) => {
  f.register(authRoutes, { prefix: "/auth" });
  f.register(whatsAppRoutes);
  f.register(whatsAppSessionRoutes);
  f.register(userRoutes);
  f.register(ticketRoutes);
  f.register(contactRoutes);
  f.register(messageRoutes);
  f.register(queueRoutes);
  f.register(quickAnswerRoutes);
  f.register(settingRoutes);
};

export default fp(routes);

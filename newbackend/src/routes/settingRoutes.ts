import { FastifyInstance } from "fastify";
import * as SettingController from "../controllers/SettingController";
import isAuth from "../middleware/isAuth";

const settingRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/settings",
    handler: SettingController.index,
    preHandler: isAuth,
  });
  fastify.route({
    method: "PUT",
    url: "/settings/:settingKey",
    handler: SettingController.update,
    preHandler: isAuth,
  });
};

export default settingRoutes;

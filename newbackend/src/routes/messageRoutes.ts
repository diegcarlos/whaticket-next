// import { Router } from "express";
// import multer from "multer";
// import isAuth from "../middleware/isAuth";
// import uploadConfig from "../config/upload";

// import * as MessageController from "../controllers/MessageController";

// const messageRoutes = Router();

// const upload = multer(uploadConfig);

// messageRoutes.get("/messages/:ticketId", isAuth, MessageController.index);

// messageRoutes.post(
//   "/messages/:ticketId",
//   isAuth,
//   upload.array("medias"),
//   MessageController.store
// );

// messageRoutes.delete("/messages/:messageId", isAuth, MessageController.remove);

// export default messageRoutes;

import { FastifyInstance } from "fastify";
import { upload } from "../config/upload";
import * as MessageController from "../controllers/MessageController";
import isAuth from "../middleware/isAuth";

const messageRoutes = async function (fastify: FastifyInstance, opts: any) {
  fastify.route({
    method: "GET",
    url: "/messages/:ticketId",
    handler: MessageController.index,
    preHandler: isAuth,
  });

  fastify.route({
    method: "POST",
    url: "/messages/:messageId",
    handler: async (req, reply) => {
      const fileObject = await req.saveRequestFiles();

      await upload(fileObject);
      MessageController.store(req, reply);
    },
    preHandler: isAuth,
  });

  fastify.route({
    method: "DELETE",
    url: "/messages/:messageId",
    handler: MessageController.remove,
    preHandler: isAuth,
  });
};

export default messageRoutes;

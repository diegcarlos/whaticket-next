import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import routes from "./routes";
import { logger } from "./util/logger";
require("dotenv").config();

const app = Fastify({
  logger: logger,
});

const frontEnd = process.env.FRONTEND_URL?.split(",");
app.register(cors, {
  origin: frontEnd,
  methods: ["GET", "POST", "PUT", "DELETE", "PATH"],
  credentials: true,
});
app.register(multipart);
app.register(routes);
app.register(cookie);

export default app;

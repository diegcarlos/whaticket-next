import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify from "fastify";
import routes from "./routes";
require("dotenv").config();

const app = Fastify({
  logger: true,
});

const frontEnd = process.env.FRONTEND_URL?.split(",");
app.register(cors, {
  origin: frontEnd,
  methods: ["GET", "POST", "PUT", "DELETE", "PATH"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(routes);
app.register(cookie);

export default app;

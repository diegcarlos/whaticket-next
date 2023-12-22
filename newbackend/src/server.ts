import app from "./app";
import { initIO } from "./libs/socket";
import { logger } from "./util/logger";

try {
  app.listen({ port: Number(process.env.PORT) });
  logger.info(`Servidor iniciado em http://localhost:${process.env.PORT}`);
} catch (err) {
  logger.error(err);
  process.exit(1);
}
initIO(app.server);

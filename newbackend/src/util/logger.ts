import pino from "pino";
import pinoPretty from "pino-pretty";

const logger = pino(pinoPretty({ colorize: true }));

export { logger };

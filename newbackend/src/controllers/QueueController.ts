import { FastifyRequest as Request, FastifyReply as Response } from "fastify";
import { getIO } from "../libs/socket";
import CreateQueueService from "../services/QueueService/CreateQueueService";
import DeleteQueueService from "../services/QueueService/DeleteQueueService";
import ListQueuesService from "../services/QueueService/ListQueuesService";
import ShowQueueService from "../services/QueueService/ShowQueueService";
import UpdateQueueService from "../services/QueueService/UpdateQueueService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const queues = await ListQueuesService();

  return res.send(queues);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, color, greetingMessage }: any = req.body;

  const queue = await CreateQueueService({ name, color, greetingMessage });

  const io = getIO();
  io.emit("queue", {
    action: "update",
    queue,
  });

  return res.send(queue);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { queueId }: any = req.params;

  const queue = await ShowQueueService(queueId);

  return res.send(queue);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId }: any = req.params;
  const { body }: any = req;

  const queue = await UpdateQueueService(queueId, body);

  const io = getIO();
  io.emit("queue", {
    action: "update",
    queue,
  });

  return res.send(queue);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId }: any = req.params;

  await DeleteQueueService(queueId);

  const io = getIO();
  io.emit("queue", {
    action: "delete",
    queueId: +queueId,
  });

  return res.status(200).send();
};

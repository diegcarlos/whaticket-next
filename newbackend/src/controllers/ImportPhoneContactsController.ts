import { FastifyRequest as Request, FastifyReply as Response } from "fastify";
import ImportContactsService from "../services/WbotServices/ImportContactsService";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { user }: any = req.body;
  const userId: number = parseInt(user.id);
  await ImportContactsService(userId);

  return res.send({ message: "contacts imported" });
};

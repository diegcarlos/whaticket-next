import { FastifyRequest as Request, FastifyReply as Response } from "fastify";
import * as Yup from "yup";
import { getIO } from "../libs/socket";

import CreateQuickAnswerService from "../services/QuickAnswerService/CreateQuickAnswerService";
import DeleteQuickAnswerService from "../services/QuickAnswerService/DeleteQuickAnswerService";
import ListQuickAnswerService from "../services/QuickAnswerService/ListQuickAnswerService";
import ShowQuickAnswerService from "../services/QuickAnswerService/ShowQuickAnswerService";
import UpdateQuickAnswerService from "../services/QuickAnswerService/UpdateQuickAnswerService";

import AppError from "../errors/AppError";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

interface QuickAnswerData {
  shortcut: string;
  message: string;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;

  const { quickAnswers, count, hasMore } = await ListQuickAnswerService({
    searchParam,
    pageNumber,
  });

  return res.send({ quickAnswers, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const newQuickAnswer: QuickAnswerData = req.body as QuickAnswerData;

  const QuickAnswerSchema = Yup.object().shape({
    shortcut: Yup.string().required(),
    message: Yup.string().required(),
  });

  try {
    await QuickAnswerSchema.validate(newQuickAnswer);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const quickAnswer = await CreateQuickAnswerService({
    ...newQuickAnswer,
  });

  const io = getIO();
  io.emit("quickAnswer", {
    action: "create",
    quickAnswer,
  });

  return res.code(200).send(quickAnswer);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { quickAnswerId }: any = req.params;

  const quickAnswer = await ShowQuickAnswerService(quickAnswerId);

  return res.code(200).send(quickAnswer);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const quickAnswerData: QuickAnswerData = req.body as QuickAnswerData;

  const schema = Yup.object().shape({
    shortcut: Yup.string(),
    message: Yup.string(),
  });

  try {
    await schema.validate(quickAnswerData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const { quickAnswerId }: any = req.params;

  const quickAnswer = await UpdateQuickAnswerService({
    quickAnswerData,
    quickAnswerId,
  });

  const io = getIO();
  io.emit("quickAnswer", {
    action: "update",
    quickAnswer,
  });

  return res.code(200).send(quickAnswer);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { quickAnswerId }: any = req.params;

  await DeleteQuickAnswerService(quickAnswerId);

  const io = getIO();
  io.emit("quickAnswer", {
    action: "delete",
    quickAnswerId,
  });

  return res.code(200).send({ message: "Quick Answer deleted" });
};

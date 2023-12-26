import { PrismaClient, queues as Queue } from "@prisma/client";
import * as Yup from "yup";
import AppError from "../../errors/AppError";

interface QueueData {
  name: string;
  color: string;
  greetingMessage?: string;
}

const prisma = new PrismaClient();

const CreateQueueService = async (queueData: QueueData): Promise<Queue> => {
  const { color, name } = queueData;

  const queueSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "ERR_QUEUE_INVALID_NAME")
      .required("ERR_QUEUE_INVALID_NAME")
      .test(
        "Check-unique-name",
        "ERR_QUEUE_NAME_ALREADY_EXISTS",
        async (value) => {
          if (value) {
            const queueWithSameName = await prisma.queues.findFirst({
              where: { name: value },
            });

            return !queueWithSameName;
          }
          return false;
        }
      ),
    color: Yup.string()
      .required("ERR_QUEUE_INVALID_COLOR")
      .test("Check-color", "ERR_QUEUE_INVALID_COLOR", async (value) => {
        if (value) {
          const colorTestRegex = /^#[0-9a-f]{3,6}$/i;
          return colorTestRegex.test(value);
        }
        return false;
      })
      .test(
        "Check-color-exists",
        "ERR_QUEUE_COLOR_ALREADY_EXISTS",
        async (value) => {
          if (value) {
            const queueWithSameColor = await prisma.queues.findFirst({
              where: { color: value },
            });
            return !queueWithSameColor;
          }
          return false;
        }
      ),
  });

  try {
    await queueSchema.validate({ color, name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const queue = await prisma.queues.create({ data: queueData });

  return queue;
};

export default CreateQueueService;

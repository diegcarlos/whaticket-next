import {
  queues as Queue,
  users as User,
  whatsapps as Whatsapp,
} from "@prisma/client";

interface UserAdd extends User {
  queues: Queue[];
  whatsapp?: Whatsapp;
}

interface SerializedUser {
  id: number;
  name: string;
  email: string;
  profile: string;
  queues: Queue[];
  whatsapp?: Whatsapp;
}

export const SerializeUser = (user: UserAdd): SerializedUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    queues: user.queues,
    whatsapp: user.whatsapp,
  };
};

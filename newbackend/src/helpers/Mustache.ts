import { contacts as Contact } from "@prisma/client";
import Mustache from "mustache";

export default (body: string, contact: Contact): string => {
  const view = {
    name: contact ? contact.name : "",
  };
  return Mustache.render(body, view);
};

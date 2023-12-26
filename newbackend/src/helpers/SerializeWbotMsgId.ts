import {
  contacts as Contact,
  messages as Message,
  tickets as Ticket,
} from "@prisma/client";

interface TicketContacts {
  contacts: Contact;
}

type FullTicket = Ticket & TicketContacts;

const SerializeWbotMsgId = (ticket: FullTicket, message: Message): string => {
  const serializedMsgId = `${message.fromMe}_${ticket.contacts.number}@${
    ticket.isGroup ? "g" : "c"
  }.us_${message.id}`;

  return serializedMsgId;
};

export default SerializeWbotMsgId;

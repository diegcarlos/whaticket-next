import { Avatar, CardHeader } from "@mui/material";
import { i18n } from "../../translate/i18n";
interface Props {
  contacts: any;
  onClick: () => void;
  ticket: any;
}

function TicketInfo(props: Props) {
  const { contacts, onClick, ticket } = props;
  console.log(contacts);
  return (
    <CardHeader
      onClick={onClick}
      style={{ cursor: "pointer" }}
      titleTypographyProps={{ noWrap: true }}
      subheaderTypographyProps={{ noWrap: true }}
      avatar={<Avatar src={contacts.profilePicUrl} alt="contact_image" />}
      title={`${contacts.name} #${ticket.id}`}
      subheader={
        ticket.user &&
        `${i18n.t("messagesList.header.assignedTo")} ${ticket.user.name}`
      }
    />
  );
}

export default TicketInfo;

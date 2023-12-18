import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { format, isSameDay, parseISO } from "date-fns";

import {
  Avatar,
  Badge,
  Divider,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { i18n } from "../../translate/i18n";

import useAccess from "@/context/AuthContext";
import { green } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";

const useStyles = makeStyles((theme: any) => ({
  ticket: {
    position: "relative",
  },

  pendingTicket: {
    cursor: "unset",
  },

  noTicketsDiv: {
    display: "flex",
    height: "100px",
    margin: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  noTicketsText: {
    textAlign: "center",
    color: "rgb(104, 121, 146)",
    fontSize: "14px",
    lineHeight: "1.4",
  },

  noTicketsTitle: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0px",
  },

  contactNameWrapper: {
    display: "flex",
    gap: "5",
    justifyContent: "space-between",
  },

  lastMessageTime: {
    justifySelf: "flex-end",
  },

  closedBadge: {
    alignSelf: "center",
    justifySelf: "flex-end",
    marginRight: 32,
    marginLeft: "auto",
  },

  contactLastMessage: {
    paddingRight: 20,
  },

  newMessagesCount: {
    alignSelf: "center",
    marginRight: 8,
    marginLeft: "auto",
  },

  badgeStyle: {
    color: "white",
    marginLeft: "6px",
    backgroundColor: green[500],
  },

  acceptButton: {
    position: "absolute",
    left: "50%",
  },

  ticketQueueColor: {
    flex: "none",
    width: "8px",
    height: "100%",
    position: "absolute",
    top: "0%",
    left: "0%",
  },

  userTag: {
    position: "absolute",
    marginRight: 5,
    right: 5,
    bottom: 5,
    background: "#2576D2",
    color: "#ffffff",
    border: "1px solid #CCC",
    padding: 1,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    fontSize: "0.9em",
  },
}));

const TicketListItem = ({ ticket, ticketId }: any) => {
  const classes = useStyles();
  const history = useRouter();
  const path = usePathname();
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const { user } = useAccess();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAcepptTicket = async (id: any) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "open",
        userId: user?.id,
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${id}`);
  };

  const handleSelectTicket = (id: any) => {
    history.push(`/tickets/${id}`);
  };

  return (
    <div key={ticket.id}>
      <Link
        style={{ textDecoration: "none" }}
        href="/tickets/[ticketId]"
        as={`/tickets/${ticket.id}`}
        passHref
      >
        <ListItemButton
          dense
          selected={ticketId && +ticketId === ticket.id}
          className={clsx(classes.ticket, {
            [classes.pendingTicket]: ticket.status === "pending",
          })}
        >
          <Tooltip
            arrow
            placement="right"
            title={ticket.queue?.name || "Sem fila"}
          >
            <span
              style={{ backgroundColor: ticket.queue?.color || "#7C7C7C" }}
              className={classes.ticketQueueColor}
            ></span>
          </Tooltip>
          <ListItemAvatar>
            <Avatar src={ticket?.contact?.profilePicUrl} />
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <span className={classes.contactNameWrapper}>
                <Typography
                  noWrap
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  <div style={{ display: "flex", gap: 15, width: "100%" }}>
                    <span>{ticket.contact.name}</span>
                    <Badge
                      className={classes.newMessagesCount}
                      badgeContent={ticket.unreadMessages}
                      classes={{
                        badge: classes.badgeStyle,
                      }}
                    />
                  </div>
                </Typography>
                {ticket.status === "closed" && (
                  <Badge
                    className={classes.closedBadge}
                    badgeContent={"closed"}
                    color="primary"
                  />
                )}
                {ticket.lastMessage && (
                  <Typography
                    className={classes.lastMessageTime}
                    component="span"
                    variant="body2"
                    color="textSecondary"
                  >
                    {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                      <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                    ) : (
                      <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                    )}
                  </Typography>
                )}
                {ticket.whatsappId && (
                  <div
                    className={classes.userTag}
                    title={i18n.t("ticketsList.connectionTitle")}
                  >
                    {ticket.whatsapp?.name}
                  </div>
                )}
              </span>
            }
            secondary={
              <span className={classes.contactNameWrapper}>
                <Typography
                  className={classes.contactLastMessage}
                  noWrap
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  {ticket.lastMessage ? (
                    <MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>
                  ) : (
                    <br />
                  )}
                </Typography>
              </span>
            }
          />
          {ticket.status === "pending" && (
            <ButtonWithSpinner
              color="primary"
              variant="contained"
              className={classes.acceptButton}
              size="small"
              loading={loading}
              onClick={(e: any) => handleAcepptTicket(ticket.id)}
            >
              {i18n.t("ticketsList.buttons.accept")}
            </ButtonWithSpinner>
          )}
        </ListItemButton>
      </Link>
      <Divider variant="inset" component="li" />
    </div>
  );
};

export default TicketListItem;

import { useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import useSound from "use-sound";
import openSocket from "../../services/socket-io";

import useAccess from "@/context/AuthContext";
import {
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  makeStyles,
} from "@mui/material";
import { useRouter } from "next/navigation";
import alertSound from "../../assets/sound.mp3";
import useTickets from "../../hooks/useTickets";
import { i18n } from "../../translate/i18n";
import TicketListItem from "../TicketListItem";

const useStyles = makeStyles((theme: any) => ({
  tabContainer: {
    overflowY: "auto",
    maxHeight: 350,
    ...theme.scrollbarStyles,
  },
  popoverPaper: {
    width: "100%",
    maxWidth: 350,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      maxWidth: 270,
    },
  },
  noShadow: {
    boxShadow: "none !important",
  },
}));

const NotificationsPopOver = () => {
  const classes = useStyles();

  const history = useRouter();
  const { user } = useAccess();
  const ticketIdUrl = +history.location.pathname.split("/")[2];
  const ticketIdRef = useRef(ticketIdUrl);
  const anchorEl = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [, setDesktopNotifications] = useState([]);

  const { tickets } = useTickets({ withUnreadMessages: "true" });
  const [play] = useSound(alertSound);
  const soundAlertRef = useRef();

  const historyRef = useRef(history);

  useEffect(() => {
    soundAlertRef.current = play;

    if (!("Notification" in window)) {
      console.log("This browser doesn't support notifications");
    } else {
      Notification.requestPermission();
    }
  }, [play]);

  useEffect(() => {
    setNotifications(tickets);
  }, [tickets]);

  useEffect(() => {
    ticketIdRef.current = ticketIdUrl;
  }, [ticketIdUrl]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinNotification"));

    socket.on("ticket", (data) => {
      if (data.action === "updateUnread" || data.action === "delete") {
        setNotifications((prevState) => {
          const ticketIndex = prevState.findIndex(
            (t) => t.id === data.ticketId
          );
          if (ticketIndex !== -1) {
            prevState.splice(ticketIndex, 1);
            return [...prevState];
          }
          return prevState;
        });

        setDesktopNotifications((prevState) => {
          const notfiticationIndex = prevState.findIndex(
            (n) => n.tag === String(data.ticketId)
          );
          if (notfiticationIndex !== -1) {
            prevState[notfiticationIndex].close();
            prevState.splice(notfiticationIndex, 1);
            return [...prevState];
          }
          return prevState;
        });
      }
    });

    socket.on("appMessage", (data) => {
      if (
        data.action === "create" &&
        !data.message.read &&
        (data.ticket.userId === user?.id || !data.ticket.userId)
      ) {
        setNotifications((prevState) => {
          const ticketIndex = prevState.findIndex(
            (t) => t.id === data.ticket.id
          );
          if (ticketIndex !== -1) {
            prevState[ticketIndex] = data.ticket;
            return [...prevState];
          }
          return [data.ticket, ...prevState];
        });

        const shouldNotNotificate =
          (data.message.ticketId === ticketIdRef.current &&
            document.visibilityState === "visible") ||
          (data.ticket.userId && data.ticket.userId !== user?.id) ||
          data.ticket.isGroup;

        if (shouldNotNotificate) return;

        handleNotifications(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleNotifications = (data) => {
    const { message, contact, ticket } = data;

    const options = {
      body: `${message.body} - ${format(new Date(), "HH:mm")}`,
      icon: contact.profilePicUrl,
      tag: ticket.id,
      renotify: true,
    };

    const notification = new Notification(
      `${i18n.t("tickets.notification.message")} ${contact.name}`,
      options
    );

    notification.onclick = (e) => {
      e.preventDefault();
      window.focus();
      historyRef.current.push(`/tickets/${ticket.id}`);
    };

    setDesktopNotifications((prevState) => {
      const notfiticationIndex = prevState.findIndex(
        (n) => n.tag === notification.tag
      );
      if (notfiticationIndex !== -1) {
        prevState[notfiticationIndex] = notification;
        return [...prevState];
      }
      return [notification, ...prevState];
    });

    soundAlertRef.current();
  };

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const NotificationTicket = ({ children }) => {
    return <div onClick={handleClickAway}>{children}</div>;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        ref={anchorEl}
        aria-label="Open Notifications"
        color="inherit"
      >
        <Badge badgeContent={notifications.length} color="secondary">
          <ChatIcon />
        </Badge>
      </IconButton>
      <Popover
        disableScrollLock
        open={isOpen}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{ paper: classes.popoverPaper }}
        onClose={handleClickAway}
      >
        <List dense className={classes.tabContainer}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText>{i18n.t("notifications.noTickets")}</ListItemText>
            </ListItem>
          ) : (
            notifications.map((ticket) => (
              <NotificationTicket key={ticket.id}>
                <TicketListItem ticket={ticket} />
              </NotificationTicket>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationsPopOver;

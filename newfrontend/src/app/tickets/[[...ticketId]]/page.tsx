"use client";
import Ticket from "@/components/Ticket";
import TicketsManager from "@/components/TicketsManager";
import { i18n } from "@/translate/i18n";
import { Grid, Hidden, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme: any) => ({
  chatContainer: {
    flex: 1,
    // // backgroundColor: "#eee",
    // padding: theme.spacing(4),
    // height: `calc(100% - 48px)`,
    overflowY: "hidden",
  },

  chatPaper: {
    display: "flex",
    height: "100%",
  },

  contactsWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  },
  contactsWrapperSmall: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
    [theme.breakpoints?.down("sm")]: {
      display: "none",
    },
  },
  messagesWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },
  welcomeMsg: {
    backgroundColor: "#eee",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
    borderRadius: 0,
  },
  ticketsManager: {},
  ticketsManagerClosed: {
    [theme.breakpoints?.down("sm")]: {
      display: "none",
    },
  },
}));

function Chat({ params }: any) {
  const classes = useStyles();
  let { ticketId } = params;
  const [selectTicketId, setSelectTicketId] = useState<any>(null);

  useEffect(() => {
    setSelectTicketId(ticketId);
  }, [ticketId]);

  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatPaper}>
        <Grid container spacing={0}>
          <Grid
            item
            xs={12}
            md={4}
            className={
              selectTicketId
                ? classes.contactsWrapperSmall
                : classes.contactsWrapper
            }
          >
            <TicketsManager
              onSelectTicket={(data) => setSelectTicketId(String(data))}
            />
          </Grid>
          <Grid item xs={12} md={8} className={classes.messagesWrapper}>
            {selectTicketId > 0 ? (
              <Ticket ticketId={selectTicketId} />
            ) : (
              <Hidden only={["sm", "xs"]}>
                <Paper className={classes.welcomeMsg}>
                  <span>{i18n.t("chat.noTicketMessage")}</span>
                </Paper>
              </Hidden>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Chat;

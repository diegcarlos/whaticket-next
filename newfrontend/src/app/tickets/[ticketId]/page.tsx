"use client";
import Ticket from "@/components/Ticket";
import TicketsManager from "@/components/TicketsManager";
import { i18n } from "@/translate/i18n";
import { Grid, Hidden, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";

const classes: { [v: string]: CSSProperties } = {
  chatContainer: {
    flex: 1,
    // // backgroundColor: "#eee",
    // padding: theme.spacing(4),
    height: `calc(100vh - 80px)`,
    overflowY: "hidden",
  },

  chatPapper: {
    // backgroundColor: "red",
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
  },
  messagessWrapper: {
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
};

function Chat({ params }: any) {
  const {} = useRouter();
  const { ticketId } = params;
  return (
    <div style={classes.chatContainer}>
      <div style={classes.chatPapper}>
        <Grid container spacing={0}>
          {/* <Grid item xs={4} style={classes.contactsWrapper}> */}
          <Grid
            item
            xs={12}
            md={4}
            sx={
              ticketId ? classes.contactsWrapperSmall : classes.contactsWrapper
            }
          >
            <TicketsManager />
          </Grid>
          <Grid item xs={12} md={8} sx={classes.messagessWrapper}>
            {/* <Grid item xs={8} style={classes.messagessWrapper}> */}
            {ticketId ? (
              <>
                <Ticket ticketId={ticketId} />
              </>
            ) : (
              <Hidden only={["sm", "xs"]}>
                <Paper style={classes.welcomeMsg}>
                  {/* <Paper square variant="outlined" className={classes.welcomeMsg}> */}
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

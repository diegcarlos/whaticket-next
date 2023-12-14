import { CSSProperties, useState } from "react";

import { i18n } from "../../translate/i18n";

import { Close } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Drawer,
  IconButton,
  InputLabel,
  Paper,
  Typography,
} from "@mui/material";
import Link from "next/link";
import ContactDrawerSkeleton from "../ContactDrawerSkeleton";
import ContactModal from "../ContactModal";
import MarkdownWrapper from "../MarkdownWrapper";

const drawerWidth = 320;

const classes: { [v: string]: CSSProperties } = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    display: "flex",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  header: {
    display: "flex",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "#eee",
    alignItems: "center",
    minHeight: "73px",
    justifyContent: "flex-start",
  },
  content: {
    display: "flex",
    backgroundColor: "#eee",
    flexDirection: "column",
    padding: "8px 0px 8px 8px",
    height: "100%",
    overflowY: "scroll",
  },

  contactAvatar: {
    margin: 15,
    width: 160,
    height: 160,
  },

  contactHeader: {
    display: "flex",
    padding: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  contactDetails: {
    marginTop: 8,
    padding: 8,
    display: "flex",
    flexDirection: "column",
  },
  contactExtraInfo: {
    marginTop: 4,
    padding: 6,
  },
};

function ContactDrawer({ open, handleDrawerClose, contact, loading }: any) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Drawer
      sx={classes.drawer}
      variant="persistent"
      anchor="right"
      open={open}
      PaperProps={{ style: { position: "absolute", ...classes.drawerPaper } }}
      BackdropProps={{ style: { position: "absolute" } }}
      ModalProps={{
        container: document.getElementById("drawer-container"),
        style: { position: "absolute" },
      }}
    >
      <div style={classes.header}>
        <IconButton onClick={handleDrawerClose}>
          <Close />
        </IconButton>
        <Typography style={{ justifySelf: "center" }}>
          {i18n.t("contactDrawer.header")}
        </Typography>
      </div>
      {loading ? (
        <ContactDrawerSkeleton classes={classes} />
      ) : (
        <div style={classes.content}>
          <Paper square variant="outlined" sx={classes.contactHeader}>
            <Avatar
              alt={contact.name}
              src={contact.profilePicUrl}
              sx={classes.contactAvatar}
            ></Avatar>

            <Typography>{contact.name}</Typography>
            <Typography>
              <Link href={`tel:${contact.number}`}>{contact.number}</Link>
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setModalOpen(true)}
            >
              {i18n.t("contactDrawer.buttons.edit")}
            </Button>
          </Paper>
          <Paper square variant="outlined" sx={classes.contactDetails}>
            <ContactModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              contactId={contact.id}
            ></ContactModal>
            <Typography variant="subtitle1">
              {i18n.t("contactDrawer.extraInfo")}
            </Typography>
            {contact?.extraInfo?.map((info: any) => (
              <Paper
                key={info.id}
                square
                variant="outlined"
                style={classes.contactExtraInfo}
              >
                <InputLabel>{info.name}</InputLabel>
                <Typography component="div" noWrap style={{ paddingTop: 2 }}>
                  <MarkdownWrapper>{info.value}</MarkdownWrapper>
                </Typography>
              </Paper>
            ))}
          </Paper>
        </div>
      )}
    </Drawer>
  );
}

export default ContactDrawer;

import { useEffect, useState } from "react";

import useAccess from "@/context/AuthContext";
import { Avatar, Button, Divider, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import toastError from "../../errors/toastError";
import api from "../../services/api";

function VcardPreview({ contact, numbers }: any) {
  const history = useRouter();
  const { user } = useAccess();

  const [selectedContact, setContact] = useState({
    id: null,
    name: "",
    number: 0,
    profilePicUrl: "",
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          let contactObj = {
            name: contact,
            // number: numbers.replace(/\D/g, ""),
            number: numbers !== undefined && numbers.replace(/\D/g, ""),
            email: "",
          };
          const { data } = await api.post("/contact", contactObj);
          setContact(data);
        } catch (err) {
          console.log(err);
          toastError(err);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [contact, numbers]);

  const handleNewChat = async () => {
    try {
      const { data: ticket } = await api.post("/tickets", {
        contactId: selectedContact.id,
        userId: user.id,
        status: "open",
      });
      history.push(`/tickets/${ticket.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <>
      <div
        style={{
          minWidth: "250px",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Avatar src={selectedContact.profilePicUrl} />
          </Grid>
          <Grid item xs={9}>
            <Typography
              style={{ marginTop: "12px", marginLeft: "10px" }}
              variant="subtitle1"
              color="primary"
              gutterBottom
            >
              {selectedContact.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
            <Button
              fullWidth
              color="primary"
              onClick={handleNewChat}
              disabled={!selectedContact.number}
            >
              Conversar
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default VcardPreview;

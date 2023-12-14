import { ArrowBackIos } from "@mui/icons-material";
import { Button, Card } from "@mui/material";
import { useRouter } from "next/navigation";
import TicketHeaderSkeleton from "../TicketHeaderSkeleton";

const classes = {
  ticketHeader: {
    display: "flex",
    backgroundColor: "#eee",
    flex: "none",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
};

const TicketHeader = ({ loading, children }: any) => {
  const history = useRouter();
  const handleBack = () => {
    history.push("/tickets");
  };

  return (
    <>
      {loading ? (
        <TicketHeaderSkeleton />
      ) : (
        <Card square sx={classes.ticketHeader}>
          <Button color="primary" onClick={handleBack}>
            <ArrowBackIos />
          </Button>
          {children}
        </Card>
      )}
    </>
  );
};

export default TicketHeader;

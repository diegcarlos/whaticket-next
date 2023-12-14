import { Avatar, Card, CardHeader, Skeleton } from "@mui/material";

const classes = {
  ticketHeader: {
    display: "flex",
    backgroundColor: "#eee",
    flex: "none",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
};

const TicketHeaderSkeleton = () => {
  return (
    <Card square sx={classes.ticketHeader}>
      <CardHeader
        titleTypographyProps={{ noWrap: true }}
        subheaderTypographyProps={{ noWrap: true }}
        avatar={
          <Skeleton animation="wave" variant="circular">
            <Avatar alt="contact_image" />
          </Skeleton>
        }
        title={<Skeleton animation="wave" width={80} />}
        subheader={<Skeleton animation="wave" width={140} />}
      />
    </Card>
  );
};

export default TicketHeaderSkeleton;

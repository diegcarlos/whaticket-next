"use client";
import Chart from "@/components/Chart";
import useAccess from "@/context/AuthContext";
import useTickets from "@/hooks/useTickets";
import { Container, Grid, Paper, Typography } from "@mui/material";

export default function HomePage() {
  const { user } = useAccess();
  var userQueueIds: number[] = [];

  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q) => q.id);
  }
  const GetTickets = (status: any, showAll: any, withUnreadMessages: any) => {
    const { count } = useTickets({
      status: status,
      showAll: showAll,
      withUnreadMessages: withUnreadMessages,
      queueIds: JSON.stringify(userQueueIds),
    });
    return count;
  };
  return (
    <div>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper style={{ overflow: "hidden", padding: 30 }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                Em Atendimento
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {GetTickets("open", "true", "false")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper style={{ overflow: "hidden", padding: 30 }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                Aguardando
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {GetTickets("pending", "true", "false")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper style={{ overflow: "hidden", padding: 30 }}>
              <Typography component="h3" variant="h6" color="primary" paragraph>
                Finalizado
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {GetTickets("closed", "true", "false")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Chart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

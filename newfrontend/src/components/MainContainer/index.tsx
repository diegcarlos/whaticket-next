import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactNode } from "react";

const useStyles = makeStyles(() => ({
  mainContainer: {
    flex: 1,
    // padding: theme.spacing(2),
    // height: `calc(100% - 48px)`,
    padding: "9px 4px 0 4px",
    height: "100%",
  },

  contentWrapper: {
    height: "100%",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
}));

interface Props {
  children: ReactNode;
}

function MainContainer(props: Props) {
  const { children } = props;

  const classes = useStyles();

  return (
    <Container className={classes.mainContainer} maxWidth={false}>
      <div className={classes.contentWrapper}>{children}</div>
    </Container>
  );
}

export default MainContainer;

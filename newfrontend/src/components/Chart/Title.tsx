import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Title(props: Props) {
  const { children } = props;
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {children}
    </Typography>
  );
}

export default Title;

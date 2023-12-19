import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Title(props: Props) {
  const { children } = props;
  return (
    <Typography variant="h5" color="primary" gutterBottom>
      {children}
    </Typography>
  );
}

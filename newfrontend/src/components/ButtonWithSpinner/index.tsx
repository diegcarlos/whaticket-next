import { Button, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";

const classes = {
  button: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
};

const ButtonWithSpinner = ({ loading, children, ...rest }: any) => {
  return (
    <Button sx={classes.button} disabled={loading} {...rest}>
      {children}
      {loading && <CircularProgress size={24} sx={classes.buttonProgress} />}
    </Button>
  );
};

export default ButtonWithSpinner;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { i18n } from "../../translate/i18n";

interface Props {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: (data: boolean) => void;
  onConfirm: () => void;
}

function ConfirmationModal(props: Props) {
  const { title, children, open, onClose, onConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{children}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => onClose(false)}
          color="primary"
        >
          {i18n.t("confirmationModal.buttons.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose(false);
            onConfirm();
          }}
          color="secondary"
        >
          {i18n.t("confirmationModal.buttons.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationModal;

import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { i18n } from "../../translate/i18n";

const TicketsQueueSelect = ({
  userQueues,
  selectedQueueIds = [],
  onChange,
}: any) => {
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: 120, marginTop: -4 }}>
      <FormControl fullWidth margin="dense">
        <Select
          size="small"
          multiple
          displayEmpty
          variant="outlined"
          value={selectedQueueIds}
          onChange={handleChange}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
          renderValue={() => i18n.t("ticketsQueueSelect.placeholder")}
        >
          {userQueues?.length > 0 &&
            userQueues.map((queue: any) => (
              <MenuItem dense key={queue.id} value={queue.id}>
                <Checkbox
                  style={{
                    color: queue.color,
                  }}
                  size="small"
                  color="primary"
                  checked={selectedQueueIds.indexOf(queue.id) > -1}
                />
                <ListItemText primary={queue.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TicketsQueueSelect;

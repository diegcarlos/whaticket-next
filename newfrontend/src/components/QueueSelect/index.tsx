import { Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";

const classes: { [v: string]: CSSProperties } = {
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
};

interface Props {
  selectedQueueIds: any[];
  onChange: (data: any) => void;
}

const QueueSelect = (props: Props) => {
  const { selectedQueueIds, onChange } = props;
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queue");
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  const handleChange = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ marginTop: 6 }}>
      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel>{i18n.t("queueSelect.inputLabel")}</InputLabel>
        <Select
          multiple
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
          renderValue={(selected) => (
            <div style={classes.chips}>
              {selected?.length > 0 &&
                selected.map((id) => {
                  const queue: any = queues.find((q: any) => q.id === id);
                  return queue ? (
                    <Chip
                      key={id}
                      style={{ backgroundColor: queue.color }}
                      variant="outlined"
                      label={queue.name}
                      sx={classes.chip}
                    />
                  ) : null;
                })}
            </div>
          )}
        >
          {queues.map((queue: any) => (
            <MenuItem key={queue.id} value={queue.id}>
              {queue.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default QueueSelect;

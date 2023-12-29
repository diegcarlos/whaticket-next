"use client";
import { useEffect, useState } from "react";
import openSocket from "../../services/socket-io";

import { toast } from "react-toastify";

import { i18n } from "@/translate/i18n";
import { Container, Paper, Select, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: "8px 8px 3px",
  },

  paper: {
    padding: 2,
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
  },

  settingOption: {
    marginLeft: "auto",
  },
  margin: {
    margin: 1,
  },
}));

const Settings = () => {
  const classes = useStyles();

  const [settings, setSettings] = useState<any>([]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const socket = openSocket();

    socket.on("settings", (data) => {
      if (data.action === "update") {
        setSettings((prevState: any) => {
          const aux: any = [...prevState];
          const settingIndex = aux.findIndex(
            (s: any) => s.key === data.setting.key
          );
          aux[settingIndex].value = data.setting.value;
          return aux;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChangeSetting = async (e: any) => {
    const selectedValue = e.target.value;
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue,
      });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const getSettingValue = (key: any) => {
    console.log(key, settings);
    const find = settings.find((s: any) => s.key === key);
    return find?.value;
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Typography variant="body2" gutterBottom>
          {i18n.t("settings.title")}
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant="body1">
            {i18n.t("settings.settings.userCreation.name")}
          </Typography>
          <Select
            size="small"
            margin="dense"
            variant="outlined"
            native
            id="userCreation-setting"
            name="userCreation"
            value={
              settings && settings.length > 0 && getSettingValue("userCreation")
            }
            className={classes.settingOption}
            onChange={handleChangeSetting}
          >
            <option value="enabled">
              {i18n.t("settings.settings.userCreation.options.enabled")}
            </option>
            <option value="disabled">
              {i18n.t("settings.settings.userCreation.options.disabled")}
            </option>
          </Select>
        </Paper>

        <Paper className={classes.paper}>
          <TextField
            id="api-token-setting"
            aria-readonly
            label="Token Api"
            margin="dense"
            variant="outlined"
            fullWidth
            value={
              settings && settings.length > 0 && getSettingValue("userApiToken")
            }
          />
        </Paper>
      </Container>
    </div>
  );
};

export default Settings;

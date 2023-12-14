"use client";
import useAccess from "@/context/AuthContext";
import { Dropdown, MenuButton, Menu as MenuDrop } from "@mui/base";
import {
  AccountCircle as AccountCircleIcon,
  AccountTreeOutlined as AccountTreeIcon,
  ContactPhoneOutlined as ContactPhoneIcon,
  DashboardOutlined as DashboardIcon,
  Notifications as NotificationsIcon,
  PeopleAltOutlined as PeopleAltIcon,
  QuestionAnswerOutlined as QuestionAnswerIcon,
  SettingsOutlined as SettingsIcon,
  SyncAltOutlined as SyncAltIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Badge, MenuItem } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import * as React from "react";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const LINKS = [
  { text: "Dashboard", href: "/", icon: DashboardIcon },
  { text: "Conexões", href: "/connections", icon: SyncAltIcon },
  { text: "Tickets", href: "/tickets/0", icon: WhatsAppIcon },
  { text: "Contatos", href: "/contacts", icon: ContactPhoneIcon },
  {
    text: "Respostas rápidas",
    href: "/quickAnswers",
    icon: QuestionAnswerIcon,
  },
];

const PLACEHOLDER_LINKS = [
  { text: "Usuários", href: "/users", icon: PeopleAltIcon },
  { text: "Filas", href: "/queues", icon: AccountTreeIcon },
  { text: "Configurações", href: "/settings", icon: SettingsIcon },
];

interface Props {
  children: React.ReactNode;
}

export default function Menu(props: Props) {
  const { children } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const { handleLogout } = useAccess();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap component="div">
            Bot Whats
          </Typography>
          <div>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Dropdown>
              {/* @ts-ignore */}
              <MenuButton color="inherit" slots={{ root: IconButton }}>
                <AccountCircleIcon />
              </MenuButton>
              <MenuDrop slots={{ listbox: Listbox }}>
                <MenuItem>Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </MenuDrop>
            </Dropdown>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {LINKS.map(({ text, href, icon: Icon }) => (
            <ListItem key={href} disablePadding>
              <ListItemButton component={Link} href={href}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: "auto" }} />
        <List>
          <ListSubheader inset>Administração</ListSubheader>
          {PLACEHOLDER_LINKS.map(({ text, icon: Icon, href }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={Link} href={href}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

const Listbox = styled("ul")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: '#fff';
  border: #807e7e;
  color:  #808080;
  box-shadow: 0px 4px 30px #808080;
  z-index: 1;
  `
);

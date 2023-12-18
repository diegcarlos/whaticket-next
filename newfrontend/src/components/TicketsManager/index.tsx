import { CSSProperties, useEffect, useRef, useState } from "react";

import NewTicketModal from "../NewTicketModal";
import TabPanel from "../TabPanel";
import TicketsList from "../TicketsList";

import useAccess from "@/context/AuthContext";
import { CheckBox, MoveToInbox, Search } from "@mui/icons-material";
import {
  Badge,
  Button,
  FormControlLabel,
  InputBase,
  Paper,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import { i18n } from "../../translate/i18n";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";

const classes: { [v: string]: CSSProperties } = {
  ticketsWrapper: {
    position: "relative",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  tabsHeader: {
    flex: "none",
    backgroundColor: "#eee",
  },

  settingsIcon: {
    alignSelf: "center",
    marginLeft: "auto",
    padding: 8,
  },

  tab: {
    minWidth: 120,
    width: 120,
  },
  ticketOptionsBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fafafa",
    paddingLeft: 2,
    paddingRight: 2,
  },

  serachInputWrapper: {
    flex: 1,
    background: "#fff",
    display: "flex",
    borderRadius: 40,
    padding: 4,
  },

  searchIcon: {
    color: "grey",
    marginLeft: 6,
    marginRight: 6,
    alignSelf: "center",
  },

  searchInput: {
    flex: 1,
    border: "none",
    borderRadius: 30,
  },

  badge: {
    right: "-10px",
  },
  show: {
    display: "block",
  },
  hide: {
    display: "none !important",
  },
};

const TicketsManager = () => {
  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen, setTabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const searchInputRef = useRef<any>();
  const { user } = useAccess();

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const userQueueIds = user.queues?.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);

  useEffect(() => {
    if (user.profile?.toUpperCase() === "ADMIN") {
      setShowAllTickets(true);
    }
  }, []);

  useEffect(() => {
    if (tab === "search") {
      searchInputRef.current.focus();
      setSearchParam("");
    }
  }, [tab]);

  let searchTimeout: any;

  const handleSearch = (e: any) => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    if (searchedTerm === "") {
      setSearchParam(searchedTerm);
      setTab("open");
      return;
    }

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
    }, 500);
  };

  const handleChangeTab = (e: any, newValue: any) => {
    setTab(newValue);
  };

  const handleChangeTabOpen = (e: any, newValue: any) => {
    setTabOpen(newValue);
  };

  const applyPanelStyle = (status: any) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  return (
    <Paper elevation={0} variant="outlined" sx={classes.ticketsWrapper}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={(e: any) => setNewTicketModalOpen(false)}
      />
      <Paper elevation={0} square sx={classes.tabsHeader}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon label tabs example"
        >
          <Tab
            value={"open"}
            icon={<MoveToInbox />}
            label={i18n.t("tickets.tabs.open.title")}
          />
          <Tab
            value={"closed"}
            icon={<CheckBox />}
            label={i18n.t("tickets.tabs.closed.title")}
          />
          <Tab
            value={"search"}
            icon={<Search />}
            label={i18n.t("tickets.tabs.search.title")}
          />
        </Tabs>
      </Paper>
      <Paper square elevation={0} sx={classes.ticketOptionsBox}>
        {tab === "search" ? (
          <div style={classes.serachInputWrapper}>
            <Search sx={classes.searchIcon} />
            <InputBase
              sx={classes.searchInput}
              inputRef={searchInputRef}
              placeholder={i18n.t("tickets.search.placeholder")}
              type="search"
              onChange={handleSearch}
            />
          </div>
        ) : (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setNewTicketModalOpen(true)}
            >
              {i18n.t("ticketsManager.buttons.newTicket")}
            </Button>
            <Can
              role={user.profile}
              perform="tickets-manager:showall"
              yes={() => (
                <FormControlLabel
                  label={i18n.t("tickets.buttons.showAll")}
                  labelPlacement="start"
                  control={
                    <Switch
                      size="small"
                      checked={showAllTickets}
                      onChange={() =>
                        setShowAllTickets((prevState) => !prevState)
                      }
                      name="showAllTickets"
                      color="primary"
                    />
                  }
                />
              )}
            />
          </>
        )}
        <TicketsQueueSelect
          style={{ marginLeft: 6 }}
          selectedQueueIds={selectedQueueIds}
          userQueues={user?.queues}
          onChange={(values: any) => setSelectedQueueIds(values)}
        />
      </Paper>
      <TabPanel value={tab} name="open" className={classes.ticketsWrapper}>
        <Tabs
          value={tabOpen}
          onChange={handleChangeTabOpen}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={
              <Badge
                sx={classes.badge}
                badgeContent={openCount}
                color="primary"
              >
                {i18n.t("ticketsList.assignedHeader")}
              </Badge>
            }
            value={"open"}
          />
          <Tab
            label={
              <Badge
                sx={classes.badge}
                badgeContent={pendingCount}
                color="secondary"
              >
                {i18n.t("ticketsList.pendingHeader")}
              </Badge>
            }
            value={"pending"}
          />
        </Tabs>
        <Paper sx={classes.ticketsWrapper}>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val: any) => setOpenCount(val)}
            style={applyPanelStyle("open")}
          />
          <TicketsList
            status="pending"
            selectedQueueIds={selectedQueueIds}
            updateCount={(val: any) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
          />
        </Paper>
      </TabPanel>
      <TabPanel value={tab} name="closed" className={classes.ticketsWrapper}>
        <TicketsList
          status="closed"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
      <TabPanel value={tab} name="search" className={classes.ticketsWrapper}>
        <TicketsList
          searchParam={searchParam}
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
    </Paper>
  );
};

export default TicketsManager;

import React, { useState, useEffect } from "react";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import GroupRoundedIcon from "@material-ui/icons/GroupRounded";
import {
  Drawer,
  makeStyles,
  Typography,
  Divider,
  IconButton,
} from "@material-ui/core";
import { ContactsList } from "./ContactsList";

const useDrawerStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    justifyContent: "flex-start",
    width: 275,
  },
}));

const useOpenSidebarStyle = makeStyles((theme) => ({
  container: {
    position: "fixed",
    right: 10,
    bottom: 50,
  },
  icon: {
    width: 50,
    height: 50,
  },
}));

export const OpenSidebar = ({ openSidebar }) => {
  const classes = useOpenSidebarStyle();
  return (
    <div className={classes.container}>
      <IconButton onClick={openSidebar}>
        <ChevronLeftIcon className={classes.icon} />
        <GroupRoundedIcon className={classes.icon} />
      </IconButton>
    </div>
  );
};

export function ContactsSideBar() {
  const classes = useDrawerStyles();
  const [sidebar, setSidebar] = useState(false);

  const closeSidebar = () => {
    setSidebar(false);
  };
  const openSidebar = () => {
    setSidebar(true);
  };

  return (
    <div className={classes.root}>
      <Drawer variant="persistent" anchor="right" open={sidebar}>
        <div className={classes.drawerHeader}>
          <Typography variant="h5" align="center">
            Contacts
          </Typography>
          <IconButton onClick={closeSidebar}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <ContactsList />
      </Drawer>
      <OpenSidebar openSidebar={openSidebar} />
    </div>
  );
}

export default ContactsSideBar;

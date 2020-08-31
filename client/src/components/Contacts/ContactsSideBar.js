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
import { useFriends } from "../../context/friends";

const useDrawerStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    justifyContent: "flex-start",
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
  const [contacts, setContacts] = useState([]);
  const { friends } = useFriends();
  const [sidebar, setSidebar] = useState(false);

  const closeSidebar = () => {
    setSidebar(false);
  };
  const openSidebar = () => {
    setSidebar(true);
  };
  useEffect(() => {
    if (friends && friends.friends) {
      setContacts(friends.friends);
    }
  }, [friends]);

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
        {contacts && contacts.length > 0 ? (
          <ContactsList contacts={contacts} />
        ) : null}
      </Drawer>
      <OpenSidebar openSidebar={openSidebar} />
    </div>
  );
}

export default ContactsSideBar;

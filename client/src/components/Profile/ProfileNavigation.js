import React, { useEffect, useState, Fragment } from "react";
import {
  Toolbar,
  MenuItem,
  makeStyles,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import { followUser } from "../utils/follows/followUser";
import { unFollowUser } from "../utils/follows/unFollowUser";
import Newsfeed from "../Newsfeed";
import About from "./About";

let TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  navigation: {
    display: "flex",
  },
  actions: {
    display: "flex",
  },
}));

function ProfileNavigation({ follow = [], profile = {}, profileId }) {
  const classes = useStyle();
  const [isFollowing, setIsFollowing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const checkFollowing = () => {
      let following = follow.includes(profileId);
      if (following) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    };
    checkFollowing();
  }, [follow, profileId]);

  const toggleFollow = () => {
    if (isFollowing) {
      unFollowUser(profileId);
      setIsFollowing(false);
    } else {
      followUser(profileId);
      setIsFollowing(true);
    }
  };
  return (
    <Fragment>
      <Toolbar className={classes.toolbar}>
        <Tabs
          className={classes.navigation}
          value={tabIndex}
          onChange={handleChangeTab}
          aria-label="nav tabs example"
        >
          <Tab label="Timeline" />
          <Tab label="About" />
        </Tabs>
        <div className={classes.actions}>
          <MenuItem onClick={toggleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </MenuItem>
        </div>
      </Toolbar>
      <TabPanel value={tabIndex} index={0}>
        <Newsfeed userId={profileId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <About {...profile} />
      </TabPanel>
    </Fragment>
  );
}

export default ProfileNavigation;

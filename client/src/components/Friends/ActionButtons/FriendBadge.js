import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { makeStyles } from "@material-ui/core";
import SideMenu from "./ActionButtonSideMenu";
import { unfriendButtonText } from "../../../constants";

const useFriendBadgeStyle = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    color: theme.palette.success.dark,
    marginRight: 4,
  },
}));

export function FriendBadge({ friendId, sideMenuPlacement = "top" }) {
  const classes = useFriendBadgeStyle();
  return (
    <div className={classes.container}>
      <CheckCircleIcon className={classes.icon} />
      Friends
      <SideMenu
        friendId={friendId}
        buttonText={unfriendButtonText}
        menuPlacement={sideMenuPlacement}
      />
    </div>
  );
}

export default FriendBadge;

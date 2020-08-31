import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { UserAvatarAndName } from "./UserAvatarAndName";
import { acceptFriendRequest } from "../utils/friends/acceptFriendRequest";
import { rejectFriendRequest } from "../utils/friends/rejectFriendRequest";
const usePendingFriendsListStyles = makeStyles((theme) => ({
  usernameAndAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    margin: 8,
    minWidth: 40,
    minHeight: 40,
  },
  textClassNames: {
    textAlign: "left",
    width: "100%",
  },
  actionButtonContainer: {
    display: "flex",
    margin: 8,
  },
}));
export function PendingUserItem({ user }) {
  const classes = usePendingFriendsListStyles();
  return (
    <div>
      <UserAvatarAndName
        {...user}
        containerClassNames={classes.usernameAndAvatar}
        textClassNames={classes.textClassNames}
        avatarClassNames={classes.avatar}
      >
        <div className={classes.actionButtonContainer}>
          <Button onClick={() => acceptFriendRequest(user._id)}>Accept</Button>
          <Button onClick={() => rejectFriendRequest(user._id)}>Reject</Button>
        </div>
      </UserAvatarAndName>
    </div>
  );
}

export default PendingUserItem;

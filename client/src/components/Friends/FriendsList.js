import React, { Fragment } from "react";
import { useUser } from "../../context/user";
import { makeStyles, Typography } from "@material-ui/core";
import { UserAvatarAndName } from "./UserAvatarAndName";
import { FriendBadge } from "./ActionButtons/FriendBadge";

const useFriendsListStyles = makeStyles((theme) => ({
  usernameAndAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    margin: 8,
  },
  textClassNames: {
    textAlign: "left",
    width: "100%",
  },
}));

export function FriendsList() {
  const classes = useFriendsListStyles();
  const { friends } = useUser();
  return (
    <Fragment>
      <Typography align="center" variant="h5">
        Friends
      </Typography>
      {friends.map((friend) => {
        return (
          <div key={friend._id}>
            <UserAvatarAndName
              {...friend.recipient}
              containerClassNames={classes.usernameAndAvatar}
              textClassNames={classes.textClassNames}
              avatarClassNames={classes.avatar}
            >
              <FriendBadge
                friendId={friend._id}
                sideMenuPlacement="bottom-start"
              />
            </UserAvatarAndName>
          </div>
        );
      })}
    </Fragment>
  );
}

export default FriendsList;

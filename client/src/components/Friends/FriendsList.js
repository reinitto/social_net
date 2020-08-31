import React, { useEffect, useState, Fragment } from "react";
import { useFriends } from "../../context/friends";
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
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const classes = useFriendsListStyles();
  const { friends } = useFriends();
  useEffect(() => {
    if (friends && friends.friends) {
      setConfirmedFriends(friends.friends);
    }
  }, [friends]);

  return (
    <Fragment>
      <Typography align="center" variant="h5">
        Friends
      </Typography>
      {confirmedFriends.map((friend) => {
        return (
          <div key={friend._id}>
            <UserAvatarAndName
              {...friend}
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

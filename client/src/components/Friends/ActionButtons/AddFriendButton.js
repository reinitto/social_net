import React, { Fragment, useState, useEffect } from "react";
import { useFriends } from "../../../context/friends";
import AddButton from "./AddButton";
import AcceptButton from "./AcceptButton";
import FriendBadge from "./FriendBadge";

export const AddFriend = ({ friendId }) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { friends } = useFriends();
  // finds if user is in friends list
  useEffect(() => {
    if (friends) {
      let isFriend =
        friends &&
        Object.keys(friends).includes("friends") &&
        friends.friends.filter((friend) => friend._id === friendId);
      let isRequested =
        friends &&
        Object.keys(friends).includes("requested") &&
        friends.requested.filter((id) => id === friendId);
      let isPending =
        friends &&
        Object.keys(friends).includes("pending") &&
        friends.pending.filter((id) => id === friendId);
      if (isFriend.length > 0) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }
      if (isRequested.length > 0) {
        setIsRequested(true);
      } else {
        setIsRequested(false);
      }
      if (isPending.length > 0) {
        setIsPending(true);
      } else {
        setIsPending(false);
      }
    }
  }, [friends, friendId]);
  console.log(
    `isFriend
  isRequested
  isPending`,
    isFriend,
    isRequested,
    isPending
  );
  return (
    <Fragment>
      {!isFriend && !isPending ? (
        <AddButton friendId={friendId} requestSent={isRequested} />
      ) : null}
      {isPending ? <AcceptButton friendId={friendId} /> : null}
      {isFriend ? <FriendBadge friendId={friendId} /> : null}
    </Fragment>
  );
};
export default AddFriend;

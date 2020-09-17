import React, { Fragment, useState, useEffect } from "react";
import { useUser } from "../../../context/user";
import AddButton from "./AddButton";
import AcceptButton from "./AcceptButton";
import FriendBadge from "./FriendBadge";

export const AddFriend = ({ friendId }) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { friends, friendRequests, friendPending } = useUser();
  // finds if user is in friends list
  useEffect(() => {
    let isFriend =
      friends && friends.filter((friend) => friend.recipient._id === friendId);
    let isRequested =
      friendRequests && friendRequests.filter((id) => id === friendId);
    let isPending =
      friendPending && friendPending.filter((id) => id === friendId);
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
  }, [friends, friendRequests, friendPending, friendId]);

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

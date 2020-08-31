import React, { useState, useEffect } from "react";
import { useFriends } from "../context/friends";
import { getUsersById } from "../components/utils/users/getUsersById";
import { FriendsList } from "../components/Friends/FriendsList";
import { PendingList } from "../components/Friends/PendingList";

function Friends() {
  const [pendingFriendsIds, setPendingFriendsIds] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const { friends } = useFriends();
  useEffect(() => {
    if (friends && friends.pending) {
      setPendingFriendsIds(friends.pending);
    }
  }, [friends]);

  useEffect(() => {
    let isRendered = true;
    if (pendingFriendsIds.length > 0) {
      const getRequesters = async (ids) => {
        const { users, error } = await getUsersById(ids);
        if (isRendered) {
          if (error) {
            console.log(error);
          } else {
            setPendingUsers(users || []);
          }
        }
      };
      getRequesters(pendingFriendsIds);
    }
    return () => (isRendered = false);
  }, [pendingFriendsIds]);
  // display all friend requests
  return (
    <div>
      <PendingList users={pendingUsers} />
      <FriendsList />
    </div>
  );
}

export default Friends;

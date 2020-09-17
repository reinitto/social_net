import React from "react";
import { FriendsList } from "../components/Friends/FriendsList";
import { PendingList } from "../components/Friends/PendingList";

function Friends() {
  return (
    <div>
      <PendingList />
      <FriendsList />
    </div>
  );
}

export default Friends;

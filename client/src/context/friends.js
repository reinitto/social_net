import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./user";
const FriendsContext = createContext();

export default function FriendsProvider({ children }) {
  const [friends, setFriends] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const getAllFriends = async (friendsList = []) => {
      const url = "/api/friends/friendsList";

      const options = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendsIds: friendsList }),
      };
      const res = await fetch(url, options);
      const { friendLists } = await res.json();
      setFriends(friendLists);
    };
    if (user && user.friends && user.friends.length > 0) {
      getAllFriends(user.friends);
    }
  }, [user]);
  console.log("friends", friends);
  return (
    <FriendsContext.Provider value={{ friends }}>
      {children}
    </FriendsContext.Provider>
  );
}
export const useFriends = () => useContext(FriendsContext);

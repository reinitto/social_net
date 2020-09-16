import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import socketIOClient from "socket.io-client";
const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [userId, setUserId] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, seFriendRequests] = useState([]);
  const [friendPending, setFriendPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const setUserState = (user) => {
    setUser(user);
    setUserId(user.id);
    const { friends } = user;
    console.log(friends);
    let confirmedFriends = [];
    let requestedFriends = [];
    let pendingFriends = [];
    friends.forEach((friend) => {
      if (friend.status === "FRIENDS") {
        confirmedFriends.push(friend);
      } else if (friend.status === "REQUESTED") {
        requestedFriends.push(friend);
      } else if (friend.status === "PENDING") {
        pendingFriends.push(friend);
      }
    });
    console.log(
      `confirmedFriends
    requestedFriends
    pendingFriends`,
      confirmedFriends,
      requestedFriends,
      pendingFriends
    );
    setFriends(confirmedFriends);
    setFriendPending(pendingFriends);
    seFriendRequests(requestedFriends);
  };

  useEffect(() => {
    const getUser = async () => {
      const url = "/api/auth/me";
      setLoading(true);
      const res = await fetch(url);
      const { user } = await res.json();
      if (user) {
        setUserState(user);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    const initSocket = async () => {
      const ioSocket = await socketIOClient("/", {
        query: { userId },
      });
      setSocket(ioSocket);
    };
    if (userId) {
      initSocket();
    }
  }, [userId]);

  const logoutUser = useCallback(() => {
    setUser(undefined);
    setUserId("");
    setSocket(null);
    setFriends([]);
    seFriendRequests([]);
    setFriendPending([]);
  }, []);

  const loginUser = async ({ email, password }) => {
    const url = "/api/auth/login";
    let res = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    try {
      let data = await res.json();
      let { user } = data;
      if (user) {
        //  set user
        setUserState(user);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userId,
        loading,
        logoutUser,
        loginUser,
        socket,
        friends,
        friendRequests,
        friendPending,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);

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
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("");

  const getUser = async () => {
    const url = "/api/auth/me";
    const res = await fetch(url);
    const { user } = await res.json();
    if (user) {
      setUser(user);
      setUserId(user.id);
    }
    setLoading(false);
  };
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const initSocket = async () => {
      if (!socket) {
        const ioSocket = await socketIOClient("/", {
          query: { userId: user.id },
        });
        setSocket(ioSocket);
      }
    };
    if (userId) {
      initSocket();
    }
  }, [userId]);

  const logoutUser = useCallback(() => {
    setUser(undefined);
    setUserId("");
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
        setUser(user);
        setUserId(user.id);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);

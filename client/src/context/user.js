import React, { createContext, useState, useContext, useEffect } from "react";
const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const url = "/api/auth/me";
      const res = await fetch(url);
      const { user } = await res.json();
      if (user) {
        setUser(user);
        setUserId(user.id);
      }
    };
    if (user === undefined) {
      getUser();
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser, userId }}>
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);

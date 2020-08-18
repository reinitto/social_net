import React, { createContext, useState, useContext, useEffect } from "react";
const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const getUser = async () => {
      const url = "/api/auth/user";
      const res = await fetch(url);
      const { user } = await res.json();
      setUser(user);
    };
    if (user === undefined) {
      getUser();
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);

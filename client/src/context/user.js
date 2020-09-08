import React, { createContext, useState, useContext, useEffect } from "react";
const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };
    getUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, userId, loading }}>
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);

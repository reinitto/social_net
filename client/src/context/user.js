import React, { createContext, useState, useContext, useEffect } from "react";
const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
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
    if (userId) {
      getUser();
    }
  }, [userId]);

  const logoutUser = () => {
    setUser(undefined);
    setUserId("");
  };

  const loginUser = async ({ email, password }) => {
    const url = "/api/auth/login";
    let res = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log("res.status", res.status);

    try {
      let data = await res.json();
      let { error, user } = data;
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
      value={{ user, setUser, userId, loading, logoutUser, loginUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
export const useUser = () => useContext(UserContext);

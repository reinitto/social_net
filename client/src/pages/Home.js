import React from "react";
import { useUser } from "../context/user";
import Newsfeed from "../components/Newsfeed";

function Home() {
  const { user } = useUser();

  return <Newsfeed userId={user && user.id} />;
}

export default Home;

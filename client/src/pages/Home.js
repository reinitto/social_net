import React from "react";
import Newsfeed from "../components/Newsfeed";
import { useUser } from "../context/user";
function Home() {
  const { user } = useUser();
  return (
    <div>
      <Newsfeed userId={user && user.id} />
    </div>
  );
}

export default Home;

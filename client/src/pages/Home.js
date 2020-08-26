import React from "react";
import Newsfeed from "../components/Newsfeed";
import AddPost from "../components/AddPost";
import { useUser } from "../context/user";
function Home() {
  const { user } = useUser();
  return (
    <div>
      Im Home
      <AddPost />
      <Newsfeed userId={user && user.id} />
    </div>
  );
}

export default Home;

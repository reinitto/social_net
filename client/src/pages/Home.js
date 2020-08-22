import React from "react";
import Newsfeed from "../components/Newsfeed";
import AddPost from "../components/AddPost";

function Home() {
  return (
    <div>
      Im Home
      <AddPost />
      <Newsfeed />
    </div>
  );
}

export default Home;

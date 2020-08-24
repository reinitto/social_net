import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
function Newsfeed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      const url = "/api/user/newsfeed";
      const res = await fetch(url);
      const posts = await res.json();
      if (posts && posts.newsFeed) {
        setPosts(posts.newsFeed);
      }
    };
    getPosts();
  }, []);
  if (posts.length === 0) {
    return (
      <div>Your newsFeed is empty. Follow more people to get latest news!</div>
    );
  }
  console.log(posts);
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Newsfeed;

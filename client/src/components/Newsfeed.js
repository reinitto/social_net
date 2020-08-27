import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { makeStyles } from "@material-ui/core";
import { getUserFeed } from "./utils/getUserFeed";

const useNewsfeedStyles = makeStyles((theme) => ({
  newsFeedContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));
function Newsfeed({ userId }) {
  const [posts, setPosts] = useState([]);
  const classes = useNewsfeedStyles();
  useEffect(() => {
    const getPosts = async () => {
      const feed = await getUserFeed(userId);
      setPosts(feed);
    };
    if (userId) {
      getPosts();
    }
  }, [userId]);

  return (
    <div className={classes.newsFeedContainer}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Newsfeed;

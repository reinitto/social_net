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
    let isRendered = true;
    const getPosts = async () => {
      const feed = await getUserFeed(userId);
      if (isRendered) {
        setPosts(feed);
      }
    };
    if (userId) {
      getPosts();
    }
    return () => {
      isRendered = false;
    };
  }, [userId]);

  return (
    <div className={classes.newsFeedContainer}>
      {posts &&
        posts.length > 0 &&
        posts.map((post) => <PostCard key={post._id} post={post} />)}
    </div>
  );
}

export default Newsfeed;

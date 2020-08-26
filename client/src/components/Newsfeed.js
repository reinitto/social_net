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
    getPosts();
  }, [userId]);
  if (!posts || posts.length === 0) {
    return (
      <div>Your newsFeed is empty. Follow more people to get latest news!</div>
    );
  } else {
    return (
      <div className={classes.newsFeedContainer}>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    );
  }
}

export default Newsfeed;

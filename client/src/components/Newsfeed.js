import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import { getUserFeed } from "./utils/getUserFeed";
import { useUser } from "../context/user";
import PostCard from "./Post/PostCard";
import AddPost from "./Post/AddPost";

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
  const { logoutUser } = useUser();
  useEffect(() => {
    let isRendered = true;
    const getPosts = async () => {
      const res = await getUserFeed(userId);
      if (res.notAuthenticated) {
        logoutUser();
      } else {
        const { feed } = res;
        if (isRendered) {
          setPosts(feed);
        }
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
    <Fragment>
      <AddPost />
      <div className={classes.newsFeedContainer}>
        {posts &&
          posts.length > 0 &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </Fragment>
  );
}

export default Newsfeed;

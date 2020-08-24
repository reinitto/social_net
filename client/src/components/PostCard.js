import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../context/user";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Comments from "./Comments";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 345,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  media: {
    maxWidth: "100%",
    maxHeight: 500,
    overflow: "hidden",
    margin: 4,
  },
  actions: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& > button": {
      flexGrow: 1,
      flexShrink: 1,
    },
  },
  icon: {
    margin: theme.spacing(1),
  },
  iconBlue: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    color: theme.palette.common.white,
    boxSizing: "content-box",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    width: 10,
    height: 10,
  },
  postStats: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    "& > span": {
      display: "flex",
      alignItems: "center",
    },
    padding: 4,
  },
  toggleComments: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default function PostCard({ post }) {
  const classes = useStyles();
  const { user } = useUser();
  const { body, image, commentCount, likedBy } = post;
  const [comment, setComment] = useState("");
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (likedBy) {
      if (likedBy.includes(user.id)) {
        setLike(true);
      }
      setLikeCount(likedBy.length);
    } else {
      setLikeCount(0);
    }
  }, [user, likedBy]);

  const commentInputRef = useRef(null);
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  const focusCommentInput = () => {
    commentInputRef.current.focus();
  };

  const addComment = async () => {
    if (!comment) return;
    const url = "/api/post/comment";
    const payload = {
      content: {
        text: comment,
      },
      postId: post._id,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch(url, options);
    setComment("");
    console.log("res", await res.json());
  };

  const toggleLike = () => {
    if (like) {
      removeLike();
      setLike(false);
      setLikeCount(likeCount - 1);
    } else {
      addLike();
      setLike(true);
      setLikeCount(likeCount + 1);
    }
  };

  const addLike = async () => {
    const url = "/api/post/like";
    const options = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id }),
    };
    await fetch(url, options);
  };
  const removeLike = async () => {
    const url = "/api/post/unlike";
    const options = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id }),
    };
    await fetch(url, options);
  };

  console.log("user", user);
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {body}
        </Typography>
      </CardContent>
      {image ? (
        <CardMedia component="img" className={classes.media} src={image} />
      ) : null}
      <Divider variant="fullWidth" flexItem style={{ height: "1px" }} />
      <div className={classes.postStats}>
        <span>
          <ThumbUpIcon className={classes.iconBlue} />
          {likeCount}
        </span>
        <span className={classes.toggleComments} onClick={toggleComments}>{`${
          commentCount || 5
        } Comments`}</span>
      </div>
      <Divider variant="fullWidth" flexItem style={{ height: "1px" }} />
      <CardActions className={classes.actions}>
        <Button
          size="small"
          variant="text"
          color="primary"
          onClick={toggleLike}
        >
          {like ? (
            <ThumbUpIcon className={classes.icon} />
          ) : (
            <ThumbUpAltOutlinedIcon className={classes.icon} />
          )}
          <span>Like</span>
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button
          size="small"
          variant="text"
          color="primary"
          onClick={focusCommentInput}
        >
          Comment
        </Button>
      </CardActions>
      <Divider variant="fullWidth" flexItem style={{ height: "1px" }} />
      <Comments showComments={showComments} comments={post.comments} />
      <CardActions className={classes.actions}>
        <TextField
          required
          inputRef={commentInputRef}
          variant="outlined"
          fullWidth
          label="Write a comment"
          multiline
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button variant="outlined" onClick={addComment}>
          Comment
        </Button>
      </CardActions>
    </Card>
  );
}

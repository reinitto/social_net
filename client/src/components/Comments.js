import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Tooltip,
  Typography,
  Paper,
  Collapse,
  makeStyles,
  Avatar,
} from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";
import { getUserInfo } from "./utils/getUserInfo";
import { PostCommentBox } from "./PostCommentBox";
import { Link } from "react-router-dom";

import { useUser } from "../context/user";

const useCommentsStyles = makeStyles((theme) => ({
  comment: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  commentContainer: {
    display: "flex",
    width: "100%",
  },
  commentAuthor: {
    fontWeight: 600,
    fontSize: 12,
    textDecoration: "none",
    color: "inherit",
    height: "fit-content",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  commentContent: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "75%",
  },
  commentText: {
    position: "relative",
    borderRadius: 14,
    backgroundColor: theme.palette.grey[100],
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  commentLikes: {
    bottom: -15,
    right: -25,
    zIndex: 0,
    padding: 3,
    display: "flex",
    position: "absolute",
    borderWidth: 1,
    borderColor: theme.palette.grey[50],
    borderStyle: "solid",
    borderRadius: "45%",
    boxShadow: `2px 2px 1px ${theme.palette.grey[500]}`,
    alignItems: "center",
    backgroundColor: theme.palette.common.white,
  },
  commentActionsContainer: {
    display: "flex",
    alignItems: "center",
    margin: 4,
    fontSize: 12,
  },
  commentActionButton: {
    fontWeight: theme.typography.fontWeightBold,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  dividerDots: {
    marginLeft: 4,
    marginRight: 4,
  },
  icon: {
    fontSize: "1rem",
    marginRight: 4,
  },
  repliesCount: {
    maxHeight: 25,
    display: "flex",
    alignItems: "center",
    paddingLeft: "15%",
    overflow: "hidden",
    transition: "max-height 0.3s",
    "& > svg": {
      marginLeft: 4,
      marginRight: 4,
      width: "7%",
    },
  },
}));

const useCommentsListStyles = makeStyles((theme) => ({
  commenetsList: {
    width: "100%",
    paddingLeft: theme.spacing(2),
  },
}));

function Comment({ comment, parentCommentId, postId }) {
  const classes = useCommentsStyles();
  const [showReplies, setReplies] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const { user } = useUser();
  const [commenter, setCommenter] = useState({
    profile_photo: "",
    first_name: "",
    last_name: "",
    username: "",
    _id: "",
  });
  const { creator, text, likedBy = [], replies, created, _id } = comment;

  const getCommenterInfo = async (id) => {
    const user = await getUserInfo(id);
    user.profile_photo = `${user.profile_photo}`.replace(
      "upload",
      "upload/w_1000,h_1000,c_crop,g_face/w_100"
    );
    setCommenter(user);
  };

  useEffect(() => {
    if (likedBy.length > 0 && likedBy.includes(user.id)) {
      setLiked(true);
    }
    setLikedCount(likedBy.length);
    getCommenterInfo(creator);
  }, [_id, likedBy, user.id, creator]);

  const toggleReplies = () => {
    setReplies(!showReplies);
  };

  const likeComment = async () => {
    const url = "/api/post/comment/like";
    const payload = {
      postId,
      commentPath: parentCommentId,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    await fetch(url, options);
    // const data = await res.json();
  };

  const unlikeComment = async () => {
    const url = "/api/post/comment/unlike";
    const payload = {
      postId,
      commentPath: parentCommentId,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    await fetch(url, options);
    // const data = await res.json();
  };

  const toggleLikeComment = async () => {
    if (liked) {
      unlikeComment();
      setLikedCount(likedCount - 1);
      setLiked(false);
    } else {
      likeComment();
      setLikedCount(likedCount + 1);
      setLiked(true);
    }
  };

  return (
    <div className={classes.comment}>
      <div className={classes.commentContainer}>
        <Link
          to={`/profile/${commenter._id}`}
          className={classes.commentAuthor}
        >
          <Avatar
            src={commenter.profile_photo}
            className={
              parentCommentId.length > 5
                ? classes.replyAvatar
                : classes.commentAvatar
            }
            variant="circle"
          />
        </Link>

        <div className={classes.commentContent}>
          <Paper variant="outlined" className={classes.commentText}>
            <Link
              to={`/profile/${commenter._id}`}
              className={classes.commentAuthor}
            >
              <span style={{ textAlign: "left" }}>
                {user.first_name || user.last_name
                  ? `${user.first_name} ${user.last_name} `
                  : `${user.username}`}
              </span>
            </Link>
            <Typography variant="body2">{text}</Typography>
            {likedCount > 0 ? (
              <div className={classes.commentLikes}>
                <ThumbUpIcon className={classes.icon} />
                {likedCount}
              </div>
            ) : null}
          </Paper>
          <div className={classes.commentActionsContainer}>
            <span
              className={classes.commentActionButton}
              onClick={toggleLikeComment}
            >
              Like
            </span>
            <span className={classes.dividerDots}> · </span>
            <span
              onClick={toggleReplies}
              className={classes.commentActionButton}
            >
              Reply
            </span>
            <span className={classes.dividerDots}> · </span>
            <Tooltip title={dayjs(created).format("DD-MM-YYYY HH:mm")}>
              <ScheduleIcon
                className={classes.icon}
                aria-label="date comment posted"
              />
            </Tooltip>
          </div>
        </div>
      </div>
      {replies && replies.length > 0 ? (
        <div
          className={classes.repliesCount}
          onClick={toggleReplies}
          style={{
            maxHeight: !showReplies ? "25px" : "0px",
          }}
        >
          <SubdirectoryArrowRightIcon />
          {`${replies.length} Replies`}
        </div>
      ) : null}
      <CommentsList
        comments={replies}
        showComments={showReplies}
        parentCommentId={
          parentCommentId ? `${parentCommentId}.replies` : comment._id
        }
        postId={postId}
      />
    </div>
  );
}

function CommentsList({
  comments = [],
  showComments,
  commentInputRef,
  postId,
  parentCommentId = "",
}) {
  const classes = useCommentsListStyles();
  return (
    <Collapse in={showComments} className={classes.commenetsList}>
      {comments.map((comment, i) => (
        <Comment
          key={comment._id + i}
          comment={comment}
          parentCommentId={parentCommentId ? `${parentCommentId}.${i}` : `${i}`}
          postId={postId}
        />
      ))}
      <PostCommentBox
        postId={postId}
        commentInputRef={commentInputRef}
        commentPath={parentCommentId}
      />
    </Collapse>
  );
}

export default CommentsList;

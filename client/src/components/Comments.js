import React, { useState, Fragment } from "react";
import dayjs from "dayjs";
import {
  Tooltip,
  Typography,
  Paper,
  Collapse,
  makeStyles,
} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ScheduleIcon from "@material-ui/icons/Schedule";
import PostCommentBox from "./PostCommentBox";

const useCommentsStyles = makeStyles((theme) => ({
  commentContainer: {
    display: "flex",
    width: "100%",
    margin: theme.spacing(1),
  },
  commentAvatar: {
    marginLeft: 4,
    marginRight: 4,
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
}));

const useCommentsListStyles = makeStyles((theme) => ({
  commenetsList: {
    width: "100%",
  },
}));

function Comment({ comment, parentCommentId, postId }) {
  const classes = useCommentsStyles();
  const [showReplies, setReplies] = useState(false);
  const toggleReplies = () => {
    setReplies(!showReplies);
  };
  const { creator, text, image, likedBy, replies, created } = comment;
  //   get creator avatar
  // console.log("comment", comment);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className={classes.commentContainer}>
        <AccountCircleOutlinedIcon
          className={classes.commentAvatar}
          fontSize="large"
        />
        <div className={classes.commentContent}>
          <Paper variant="outlined" className={classes.commentText}>
            {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
            <Typography variant="body2">{text}</Typography>
            {likedBy ? (
              <div className={classes.commentLikes}>
                <ThumbUpIcon className={classes.icon} />
                {likedBy}
              </div>
            ) : (
              <div className={classes.commentLikes}>
                <ThumbUpIcon className={classes.icon} />
                {4}
              </div>
            )}
          </Paper>
          <div className={classes.commentActionsContainer}>
            <span className={classes.commentActionButton}>Like</span>
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
        <div onClick={toggleReplies}>{`${replies.length} Replies`}</div>
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
          key={comment._id}
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

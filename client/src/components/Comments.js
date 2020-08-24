import React from "react";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip, Typography, Paper, Collapse } from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import ScheduleIcon from "@material-ui/icons/Schedule";

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

function Comment({ comment }) {
  const classes = useCommentsStyles();
  const { creator, text, image, likes, replies, created } = comment;
  //   get creator avatar
  return (
    <div className={classes.commentContainer}>
      <AccountCircleOutlinedIcon
        className={classes.commentAvatar}
        fontSize="large"
      />
      <div className={classes.commentContent}>
        <Paper variant="outlined" className={classes.commentText}>
          {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
          <Typography variant="body2">{text}</Typography>
          {likes ? (
            <div className={classes.commentLikes}>
              <ThumbUpIcon className={classes.icon} />
              {likes}
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
          <span className={classes.commentActionButton}>Reply</span>
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
  );
}

function CommentsList({ comments, showComments }) {
  const classes = useCommentsListStyles();
  return (
    <Collapse in={showComments} className={classes.commenetsList}>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Collapse>
  );
}

export default CommentsList;

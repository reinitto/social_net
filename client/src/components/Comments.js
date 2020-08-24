import React from "react";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import {
  SvgIcon,
  Tooltip,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Paper,
  Avatar,
} from "@material-ui/core";
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
    bottom: -10,
    right: -20,
    zIndex: 0,
    padding: 3,
    display: "flex",
    position: "absolute",
    borderRadius: "45%",
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
          <div className={classes.commentLikes}>
            <ThumbUpIcon className={classes.icon} /> 4
          </div>
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

function CommentsList({ comments }) {
  const classes = useCommentsListStyles();
  return (
    <div className={classes.commenetsList}>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}

export default CommentsList;

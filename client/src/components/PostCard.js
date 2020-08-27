import React, { useState, useEffect, useRef, Fragment } from "react";
import { useUser } from "../context/user";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  MenuItem,
  Menu,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import dayjs from "dayjs";
import { getUserInfo } from "./utils/getUserInfo";
import Comments from "./Comments";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 500,
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
  cardContent: {
    paddingTop: 4,
    paddingBottom: 4,
    width: "100%",
  },
  subheaderDate: {
    fontSize: 10,
  },
}));

export default function PostCard({ post }) {
  const classes = useStyles();
  const { user } = useUser();
  const { body, image, likedBy, creator, comments } = post;
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [authorInfo, setAuthorInfo] = useState({});
  const anchorEl = useRef(null);

  const handleClose = () => {
    setSettingsVisible(false);
  };

  useEffect(() => {
    let isRendered = true;
    const getPostCreatorInfo = async (id) => {
      const user = await getUserInfo(id);
      user.profile_photo = user.profile_photo.replace(
        "upload",
        "upload/w_1000,h_1000,c_crop,g_face/w_100"
      );
      if (isRendered) {
        setAuthorInfo(user);
      }
    };
    if (likedBy) {
      if (likedBy.includes(user.id)) {
        setLike(true);
      }
      setLikeCount(likedBy.length);
    } else {
      setLikeCount(0);
    }
    if (creator) {
      getPostCreatorInfo(creator);
    }
    return () => (isRendered = false);
  }, [user, likedBy, creator]);

  const commentInputRef = useRef(null);
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  const focusCommentInput = () => {
    if (showComments) {
      commentInputRef.current.focus();
    } else {
      toggleComments();
      setTimeout(() => {
        commentInputRef.current.focus();
      }, 500);
    }
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

  const deletePost = async () => {
    const url = new URL(window.location.href + "api/post/submit");
    url.searchParams.append("postId", post._id);
    const options = {
      method: "delete",
    };
    await fetch(url.href, options);
  };
  const { profile_photo, first_name, last_name, username } = authorInfo;
  return (
    <Card className={classes.root}>
      <CardHeader
        style={{ width: "100%" }}
        avatar={
          profile_photo ? (
            <Avatar aria-label="author" src={profile_photo} />
          ) : (
            <Skeleton variant="circle" width={40} height={40} />
          )
        }
        action={
          user && user.id === post.creator ? (
            <div>
              <IconButton
                aria-label="settings"
                aria-controls="post-menu"
                aria-haspopup="true"
                onClick={() => setSettingsVisible(true)}
              >
                <MoreVertIcon ref={anchorEl} />
              </IconButton>
              <Menu
                id="post-menu"
                anchorEl={anchorEl.current}
                keepMounted
                open={settingsVisible}
                onClose={handleClose}
              >
                <MenuItem onClick={deletePost}>Delete Post</MenuItem>
              </Menu>
            </div>
          ) : null
        }
        title={
          first_name || last_name || username ? (
            <Typography>
              {first_name || last_name
                ? `${first_name} ${last_name}`
                : `${username}`}
            </Typography>
          ) : (
            <Fragment>
              <Skeleton variant="text" style={{ height: "24px" }} />
            </Fragment>
          )
        }
        subheader={
          <span className={classes.subheaderDate}>
            {dayjs(post.created).format("DD-MM-YYYY HH:mm")}
          </span>
        }
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="body2" color="textSecondary" component="p">
          {body}
        </Typography>
      </CardContent>
      {image ? (
        <CardMedia
          component="img"
          className={classes.media}
          src={image}
          loading="lazy"
        />
      ) : null}
      <Divider variant="fullWidth" flexItem style={{ height: "1px" }} />
      <div className={classes.postStats}>
        <span>
          <ThumbUpIcon className={classes.iconBlue} />
          {likeCount}
        </span>
        <span className={classes.toggleComments} onClick={toggleComments}>
          {comments && comments.length > 0
            ? `${comments.length} Comments`
            : null}
        </span>
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
      <Comments
        showComments={showComments}
        comments={post.comments}
        postId={post._id}
        commentInputRef={commentInputRef}
      />
    </Card>
  );
}

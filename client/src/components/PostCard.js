import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 345,
    maxHeight: 500,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  media: {
    maxWidth: "100%",
    maxHeight: "80%",
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
}));

export default function PostCard({ post }) {
  const classes = useStyles();
  const { body, image } = post;
  const [comment, setComment] = useState();
  const addComment = async () => {
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
    console.log("res", await res.json());
  };
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
      <CardActions className={classes.actions}>
        <Button size="small" variant="text" color="primary">
          <ThumbUpAltOutlinedIcon className={classes.icon} />
          <span>Like</span>
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button size="small" variant="text" color="primary">
          Comments
        </Button>
      </CardActions>
      <Divider variant="fullWidth" flexItem style={{ height: "1px" }} />
      <CardActions className={classes.actions}>
        <TextField
          //   variant="filled"
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

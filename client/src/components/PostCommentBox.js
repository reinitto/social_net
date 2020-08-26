import React, { useState } from "react";
import { Button, TextField, makeStyles, Avatar } from "@material-ui/core";
import { useUser } from "../context/user";

const useCommentInputStyles = makeStyles((theme) => ({
  commentInputContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    margin: theme.spacing(1),
  },
  commentInputAvatar: {
    marginLeft: 4,
    marginRight: 4,
    minWidth: "5%",
    width: "10%",
  },
  commentInputTextField: {
    backgroundColor: theme.palette.grey[100],
    padding: 10,
    borderRadius: 14,
  },
  commentInputLabel: {
    transform: "translate(14px, 13px) scale(1)",
    fontSize: 14,
  },
  commentTextField: {
    marginRight: 8,
  },
  submitButton: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 10,
  },
  commentAvatar: {
    marginLeft: 4,
    marginRight: 4,
    minWidth: "5%",
    width: 32,
    height: 32,
  },
  replyAvatar: {
    marginLeft: 4,
    marginRight: 4,
    minWidth: "5%",
    width: 24,
    height: 24,
  },
}));

function PostCommentBox({ commentInputRef, postId, commentPath = "" }) {
  const [comment, setComment] = useState("");
  const classes = useCommentInputStyles();
  const { user } = useUser();
  const addComment = async () => {
    if (!comment) return;
    const url = "/api/post/comment";
    const payload = {
      content: {
        text: comment,
      },
      postId,
      commentPath,
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

  return (
    <div className={classes.commentInputContainer}>
      <Avatar
        src={user.profile_photo.replace(
          "upload",
          "upload/w_1000,h_1000,c_crop,g_face/w_100"
        )}
        className={
          commentPath.length > 5 ? classes.replyAvatar : classes.commentAvatar
        }
        variant="circle"
      />
      <TextField
        InputProps={{ className: classes.commentInputTextField }}
        InputLabelProps={{ className: classes.commentInputLabel }}
        className={classes.commentTextField}
        required
        inputRef={commentInputRef || null}
        variant="outlined"
        fullWidth
        label="Write a comment"
        multiline
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button
        variant="outlined"
        onClick={addComment}
        className={classes.submitButton}
      >
        Comment
      </Button>
    </div>
  );
}

export default PostCommentBox;

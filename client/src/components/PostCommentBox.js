import React, { useState, Fragment } from "react";
import { Button, TextField } from "@material-ui/core";
function PostCommentBox({ commentInputRef, postId, commentPath = "" }) {
  const [comment, setComment] = useState("");

  const addComment = async () => {
    if (!comment) return;
    console.log("adding comment to path", commentPath);
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
    <Fragment>
      <TextField
        required
        inputRef={commentInputRef || null}
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
    </Fragment>
  );
}

export default PostCommentBox;

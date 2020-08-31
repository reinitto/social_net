import React, { useState } from "react";
import { addComment } from "../utils/addComment";
import TextInputBox from "../TextInputBox";

export function PostCommentBox({ commentInputRef, postId, commentPath = "" }) {
  const [message, setMessage] = useState(["", ""]);
  const [comment, setComment] = useState("");
  const submitComment = async () => {
    let { error } = await addComment({ text: comment, postId, commentPath });
    if (error) {
      setComment("");
      setMessage([error, "error"]);
    } else {
      setComment("");
    }
  };
  return (
    <TextInputBox
      text={comment}
      onChangeText={setComment}
      onSubmit={submitComment}
      message={message}
      commentInputRef={commentInputRef}
      commentPath={commentPath}
      inputPlaceholder="Write a Comment"
      submitButtonText="Comment"
    />
  );
}

export default PostCommentBox;

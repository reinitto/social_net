import React, { useState, Fragment } from "react";
import ImageUpload from "./ImageUpload";
import { Button, TextField, Typography } from "@material-ui/core";
function AddPost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const onImageUpload = {
    success: (result) => {
      const image_url = result.info.secure_url;
      setImage(image_url);
    },
    error: (error) => {
      setMessage("Image Upload failed!");
    },
  };
  const submitPost = async () => {
    setMessage("");
    const url = "/api/post/submit";
    const post = {
      body,
      image,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    };
    const res = await fetch(url, options);
    const { error } = await res.json();
    if (error) {
      setMessage("Failed to post!");
    } else {
      setMessage("Posted succesfully!");
      setBody("");
      setImage("");
    }
  };

  return (
    <Fragment>
      <Typography variant="body2" align="center">
        {message}
      </Typography>
      <TextField
        fullWidth
        label="Text"
        multiline
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <img src={image} alt="" />
      <ImageUpload
        successCallback={onImageUpload.success}
        errorCallback={onImageUpload.error}
        buttonText="Choose Picture"
      />
      <Button variant="outlined" onClick={submitPost}>
        Post
      </Button>
    </Fragment>
  );
}

export default AddPost;

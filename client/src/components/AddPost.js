import React, { useState, Fragment } from "react";
import ImageUpload from "./ImageUpload";
import { makeStyles } from "@material-ui/core";
import { TextInputBox } from "./TextInputBox";
import { submitPost } from "./utils/submitPost";

const usePostStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 500,
    padding: theme.spacing(1),
    margin: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  image: {
    maxWidth: "100%",
    maxHeight: 500,
    overflow: "hidden",
    margin: 4,
  },
  uploadImageButton: {
    margin: 8,
  },
  submitButton: {
    background: theme.palette.primary.dark,
    margin: 8,
    color: theme.palette.primary.contrastText,
  },
}));
function AddPost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState(["", "inherit"]);

  const onImageUpload = {
    success: (result) => {
      const image_url = result.info.secure_url;
      setImage(image_url);
    },
    error: (error) => {
      setMessage("Image Upload failed!");
    },
  };

  const onSubmitPost = async () => {
    setMessage("");
    const { error } = await submitPost({ body, image });
    if (error) {
      setBody("");
      setImage("");
      setMessage([error, "error"]);
    } else {
      setBody("");
      setImage("");
      setMessage(["Post successful", ""]);
    }
  };

  const classes = usePostStyles();

  return (
    <div style={{ marginTop: "8px" }}>
      <TextInputBox
        text={body}
        onChangeText={setBody}
        onSubmit={onSubmitPost}
        message={message}
        InputContainerClasses={classes.container}
        inputPlaceholder="What's on Your Mind?"
        submitButtonText="Post!"
        submitButtonClasses={classes.submitButton}
      >
        <img src={image} alt="" className={classes.image} />
        <ImageUpload
          successCallback={onImageUpload.success}
          errorCallback={onImageUpload.error}
          buttonText="Choose Picture"
        />
      </TextInputBox>
    </div>
  );
}

export default AddPost;

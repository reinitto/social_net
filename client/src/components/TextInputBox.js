import React, { Fragment, useState } from "react";
import {
  Button,
  TextField,
  makeStyles,
  Avatar,
  Typography,
} from "@material-ui/core";
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

export function TextInputBox({
  onChangeText = () => null,
  onSubmit = () => null,
  inputPlaceholder = "",
  submitButtonText = "Submit",
  text = "",
  message = ["", ""],
  commentPath = "",
  commentInputRef,
  children,
  InputContainerClasses = "",
  submitButtonClasses = "",
  inputProps = {},
}) {
  const classes = useCommentInputStyles();
  const { user } = useUser();
  const [addChar, setAddChar] = useState(true);
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      let alphaNumRe = /[a-z0-9]+/gi;
      if (text.match(alphaNumRe)) {
        setAddChar(false);
        onSubmit();
      }
    } else {
      setAddChar(true);
    }
  };
  const changeText = (e) => {
    if (addChar) {
      onChangeText(e.target.value);
    }
  };
  return (
    <Fragment>
      <Typography
        variant="body2"
        align="center"
        color={message[1] || "inherit"}
      >
        {message[0]}
      </Typography>
      <div className={InputContainerClasses || classes.commentInputContainer}>
        <div className={classes.commentInputContainer}>
          <Avatar
            src={
              user &&
              user.profile_photo &&
              user.profile_photo.replace(
                "upload",
                "upload/w_1000,h_1000,c_crop,g_face/w_100"
              )
            }
            className={
              commentPath.length > 5
                ? classes.replyAvatar
                : classes.commentAvatar
            }
            variant="circle"
          />
          <TextField
            InputProps={{
              ...inputProps,
              className: classes.commentInputTextField,
              onKeyDown,
            }}
            InputLabelProps={{ className: classes.commentInputLabel }}
            className={classes.commentTextField}
            required
            inputRef={commentInputRef || null}
            variant="outlined"
            fullWidth
            label={inputPlaceholder}
            multiline
            value={text}
            onChange={changeText}
          />
        </div>
        {children}

        <Button
          variant="outlined"
          onClick={onSubmit}
          className={submitButtonClasses || classes.submitButton}
        >
          {submitButtonText}
        </Button>
      </div>
    </Fragment>
  );
}

export default TextInputBox;

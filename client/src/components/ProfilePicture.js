import React from "react";
import { makeStyles } from "@material-ui/core";
export const ProfilePicture = ({ src }) => {
  const useStyles = makeStyles((theme) => ({
    profileImage: {
      maxWidth: "100%",
      maxHeight: "240px",
      height: "auto",
      borderRadius: "25%",
    },
  }));
  const classes = useStyles();
  return (
    <div>
      <img className={classes.profileImage} src={src} alt="profile" />
    </div>
  );
};

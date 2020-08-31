import React from "react";
import { makeStyles } from "@material-ui/core";
export const ProfilePicture = ({ src, className = "", style = {} }) => {
  const useStyles = makeStyles((theme) => ({
    profileImage: {
      maxWidth: "100%",
      maxHeight: "240px",
      height: "auto",
      borderRadius: "25%",
      ...style,
    },
  }));
  const classes = useStyles();
  return (
    <div>
      {src ? (
        <img
          className={`${classes.profileImage} ${className}`}
          src={src}
          alt="profile"
          loading="lazy"
        />
      ) : null}
    </div>
  );
};

export default ProfilePicture;

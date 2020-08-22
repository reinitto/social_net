import React from "react";
import { makeStyles } from "@material-ui/core";
export const BackgroundPicture = ({
  src,
  children,
  style = {},
  className = "",
}) => {
  const useStyles = makeStyles((theme) => ({
    backgroundImage: {
      maxWidth: "100%",
      maxHeight: "100%",
      height: "400px",
      width: "100%",
      backgroundImage: `url(${src})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
      overflow: "hidden",
      ...style,
    },
  }));
  const classes = useStyles();
  return (
    <div className={`${classes.backgroundImage} ${className}`}>{children}</div>
  );
};
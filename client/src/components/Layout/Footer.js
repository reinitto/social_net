import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { appName } from "../../constants";
let Copyright = () => {
  return (
    <div>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" to="/">
          {appName}
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </div>
  );
};
export function Footer() {
  return (
    <div>
      <Copyright />
    </div>
  );
}

export default Footer;

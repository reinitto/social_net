import React from "react";
import { makeStyles, Box, Paper, Typography } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
const useStyles = makeStyles((theme) => ({
  contentContainer: {
    display: "flex",
    alignItems: "center",
    margin: 8,
  },
  content: {
    marginLeft: 4,
  },
  socialContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
}));

function About({
  bio = "",
  email = "",
  social_profiles = { facebook: "", twitter: "", instagram: "" },
}) {
  const classes = useStyles();
  return (
    <Paper>
      <Box p={3}>
        <div className={classes.contentContainer}>
          <Typography display="inline" variant="h6">
            Bio:
          </Typography>
          <span className={classes.content}>{bio}</span>
        </div>
        <div className={classes.contentContainer}>
          <Typography display="inline" variant="h6">
            Email:
          </Typography>
          <span className={classes.content}>{email}</span>
        </div>
        <Paper elevation={4} className={classes.socialContainer}>
          <span key="facebook">
            <FacebookIcon />:{" "}
            <span>
              {" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={social_profiles["facebook"]}
              >
                {social_profiles["facebook"]}
              </a>
            </span>
          </span>
          <span key="twitter">
            <TwitterIcon /> :{" "}
            <span>
              {" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={social_profiles["twitter"]}
              >
                {social_profiles["twitter"]}
              </a>
            </span>
          </span>
          <span key="instagram">
            <InstagramIcon /> :{" "}
            <span>
              {" "}
              <a
                href={social_profiles["instagram"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social_profiles["instagram"]}
              </a>{" "}
            </span>
          </span>
          {/* {Object.keys(social_profiles).map((acc) => (
            <span key={acc}>
              {acc} : <span> {social_profiles[acc]} </span>
            </span>
          ))} */}
        </Paper>
      </Box>
    </Paper>
  );
}

export default About;

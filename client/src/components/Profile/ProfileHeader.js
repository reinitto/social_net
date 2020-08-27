import React, { Fragment } from "react";
import { BackgroundPicture } from "../BackgroundPicture";
import { ProfilePicture } from "../ProfilePicture";
import { Typography, makeStyles, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    width: "100%",
    background: `linear-gradient(${theme.palette.primary.main},${theme.palette.background.default})`,
  },
  pictureContainer: {
    maxWidth: 1024,
    maxHeight: 400,
    display: "flex",
    margin: "auto",
  },
  backgroundImage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  profileImage: {
    marginBottom: -25,
    border: "5px solid white",
  },
  profileName: {
    marginTop: 25,
    marginBottom: 25,
    fontWeight: 700,
  },
}));

function ProfileHeader({
  cover_photo,
  first_name,
  last_name,
  profile_photo,
  social_profiles,
  username,
}) {
  const classes = useStyles();
  const backgroundStyle = { overflow: "visible" };

  const name =
    first_name || last_name ? `${first_name} ${last_name}` : username;
  return (
    <Fragment>
      <div className={classes.contentContainer}>
        <div className={classes.pictureContainer}>
          <BackgroundPicture
            className={classes.backgroundImage}
            style={backgroundStyle}
            src={cover_photo}
          >
            <ProfilePicture
              className={classes.profileImage}
              src={profile_photo}
            />
          </BackgroundPicture>
        </div>
        <Typography className={classes.profileName} variant="h4" align="center">
          {name}
        </Typography>
        <Divider variant="middle" />
      </div>
    </Fragment>
  );
}

export default ProfileHeader;

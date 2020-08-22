import React, { useState, useEffect } from "react";
import { useUser } from "../context/user";
import ImageUpload from "./ImageUpload";
import {
  Button,
  TextField,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ProfilePicture } from "./ProfilePicture";
import { BackgroundPicture } from "./BackgroundPicture";

//   styles: {
//     palette: {
//       window: "#FFF",
//       windowBorder: "#90A0B3",
//       tabIcon: "#0E2F5A",
//       menuIcons: "#5A616A",
//       textDark: "#000000",
//       textLight: "#FFFFFF",
//       link: "#0078FF",
//       action: "#FF620C",
//       inactiveTabIcon: "#0E2F5A",
//       error: "#F44235",
//       inProgress: "#0078FF",
//       complete: "#20B832",
//       sourceBg: "#E4EBF1",
//     },
//     fonts: {
//       "'Cute Font', cursive":
//         "https://fonts.googleapis.com/css?family=Cute+Font",
//     },
//   },

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      padding: theme.spacing(1),
      "&>div": {
        padding: theme.spacing(1),
        maxWidth: "750px",
        justifyContent: "center",
      },
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    gridItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    success: {
      color: theme.palette.success.main,
    },
    error: {
      color: theme.palette.error.main,
    },
    imageSelectContainer: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    backgroundImageContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      maxHeight: "300px",
      margin: "auto",
    },
    avatarContainer: {
      maxWidth: "150px",
      maxHeight: "150px",
      overflow: "hidden",
      borderRadius: "50%",
    },
    uploadButtons: {
      flexGrow: 1,
      flexShrink: 1,
      margin: "4px",
    },
    subTitle: {
      width: "100%",
      textAlign: "left",
      fontWeight: theme.typography.fontWeightBold,
      marginBottom: "1rem",
      marginTop: "1rem",
    },
  };
});

function EditProfile() {
  const [message, setMessage] = useState(["", ""]);
  //   START USER DETAILS INPUTS
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [social_accounts, setSocialAccounts] = useState({});
  const [email, setEmail] = useState("");
  //   END USER DETAILS INPUTS
  const { user } = useUser();
  const classes = useStyles();

  useEffect(() => {
    const setFormState = () => {
      const {
        username,
        email,
        first_name,
        last_name,
        profile_photo,
        cover_photo,
        bio,
        social_profiles,
      } = user;
      setFirstName(first_name || "");
      setLastName(last_name || "");
      setBio(bio || "");
      setProfileImage(profile_photo || "");
      setBackgroundImage(cover_photo || "");
      setUsername(username || "");
      setEmail(email);
      setSocialAccounts(social_profiles);
    };
    if (user) {
      setFormState();
    }
  }, [user]);

  let uploadProfilePicCallback = {
    success: (result) => {
      const image_url = result.info.secure_url;
      setProfileImage(image_url);
      submitProfileEdit({
        updates_for: "profile_picture",
        data: { profileImage: image_url },
      });
    },
    error: (error) => {
      setMessage(["Upload Error! Try again", "error"]);
    },
  };

  let uploadBackgroundPicCalback = {
    success: (result) => {
      const image_url = result.info.secure_url;
      setBackgroundImage(image_url);
      submitProfileEdit({
        data: { backgroundImage: image_url },
        updates_for: "background_picture",
      });
    },
    error: (error) => {
      setMessage(["Upload Error! Try again", "error"]);
    },
  };

  const updateInfo = (e) => {
    e.preventDefault();
    submitProfileEdit({
      data: {
        username,
        email,
        bio,
        first_name: firstName,
        last_name: lastName,
        social_profiles: social_accounts,
      },
      updates_for: "info",
    });
  };

  const submitProfileEdit = async ({ data, updates_for = "info" }) => {
    setMessage(["", ""]);
    const url = "/api/user/edit";
    const body = {
      data,
      updates_for,
    };
    body.data.email = email;
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const res = await fetch(url, options);
    const res_data = await res.json();
    const { error, status } = res_data;
    if (error) {
      console.log("error", error);
      setMessage(["Update Error! Please try again!", "error"]);
    } else if (status === "ok") {
      setMessage(["Update Successful!", "success"]);
    }
  };
  return (
    <div className={classes.paper}>
      <Typography variant="h3">Edit Profile</Typography>
      <Typography className={classes[message[1]] || ""} variant="body2">
        {message[0]}
      </Typography>
      <form noValidate autoComplete="off" className={classes.form}>
        <Grid container item xs={12}>
          <Grid item xs={12} className={classes.gridItem}>
            <div className={classes.imageSelectContainer}>
              <Typography variant="h5" className={classes.subTitle}>
                Profile Picture
              </Typography>
              <ImageUpload
                successCallback={uploadProfilePicCallback.success}
                errorCallback={uploadProfilePicCallback.error}
                buttonText="Change Profile Picture"
                buttonProps={{
                  variant: "outlined",
                  color: "primary",
                  size: "small",
                  className: classes.uploadButtons,
                }}
              />
            </div>
            <div className={classes.avatarContainer}>
              <ProfilePicture src={profileImage} />
            </div>
          </Grid>
          <Grid item xs={12} className={classes.gridItem}>
            <div className={classes.imageSelectContainer}>
              <Typography variant="h5" className={classes.subTitle}>
                Background Photo
              </Typography>
              <ImageUpload
                successCallback={uploadBackgroundPicCalback.success}
                errorCallback={uploadBackgroundPicCalback.error}
                buttonText="Change Background Picture"
                buttonProps={{
                  variant: "outlined",
                  color: "primary",
                  size: "small",
                  className: classes.uploadButtons,
                }}
              />
            </div>
            <div className={classes.backgroundImageContainer}>
              <BackgroundPicture
                src={backgroundImage}
                style={{
                  backgroundAttachment: "initial",
                }}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Typography className={classes.subTitle} variant="h5">
            Bio
          </Typography>

          <TextField
            fullWidth
            label="Bio"
            multiline
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Grid container item xs={12} justify="space-between">
            <Typography variant="h5" className={classes.subTitle}>
              Personal Info
            </Typography>
            <TextField
              variant="outlined"
              name="First Name"
              type="text"
              autoComplete="given-name"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              name="Last Name"
              type="text"
              autoComplete="family-name"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              variant="outlined"
              name="Username"
              type="text"
              autoComplete="nickname"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <TextField
            fullWidth
            variant="outlined"
            autoComplete="email"
            margin="normal"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Grid container item xs={12} justify="space-between">
            <Typography variant="h5" className={classes.subTitle}>
              Social Accounts
            </Typography>
            {Object.keys(social_accounts).map((soc_prof) => (
              <TextField
                label={soc_prof}
                variant="outlined"
                value={social_accounts[soc_prof]}
                onChange={(e) =>
                  setSocialAccounts({
                    ...social_accounts,
                    [soc_prof]: e.target.value,
                  })
                }
              />
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            className={classes.submit}
            onClick={updateInfo}
          >
            Save
          </Button>
        </Grid>
      </form>
    </div>
  );
}

export default EditProfile;

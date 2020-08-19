import React, { useState, useEffect } from "react";
import { useUser } from "../context/user";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  makeStyles,
  Container,
} from "@material-ui/core";
function EditProfile() {
  const [widgetStatus, setWidgetStatus] = useState(false);
  const [widget, setWidget] = useState(null);
  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [info, setInfo] = useState({
    bio: "",
    interests: "",
  });
  const [pictures, setPictures] = useState({ profile: "", background: "" });
  const [social_accounts, setSocialAccounts] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { user } = useUser();

  const toggleWidget = () => {
    if (widgetStatus) {
      widget.hide();
      setWidgetStatus(false);
    } else {
      widget.open();
      setWidgetStatus(true);
    }
  };
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
        interests,
      } = user;
      setName({ firstName: first_name || "", lastName: last_name || "" });
      setInfo({
        bio,
        interests,
      });
      setPictures({ profile: profile_photo, background: cover_photo });
      setUsername(username);
      setEmail(email);
      setSocialAccounts(social_profiles);
    };
    if (user) {
      setFormState();
    }
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "sunshinephoto",
        uploadPreset: "cxettook",
        clientAllowedFormats: ["png", "gif", "jpeg"],
        showCompletedButton: true,
        multiple: false,
      },
      (error, result) => {
        checkUploadResult(error, result);
      }
    );
    setWidget(widget);
  }, [user]);

  let checkUploadResult = (err, res) => {
    if (err) {
      console.log("upload error", err);
    } else {
      if (res.event === "success") {
        console.log("upload successful");
        console.log("result", res);
        const url = res.info.secure_url;
      }
    }
  };

  return (
    <div>
      Edit Profile
      <form noValidate autoComplete="off">
        <Button onClick={toggleWidget}>Upload Profile Pic</Button>
        <TextField
          label="First Name"
          value={name.firstName}
          onChange={(e) => setName({ ...name, firstName: e.target.value })}
        />
        <TextField
          label="Last Name"
          value={name.lastName}
          onChange={(e) => setName({ ...name, lastName: e.target.value })}
        />
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="bio"
          multiline
          value={info.bio}
          onChange={(e) => setInfo({ ...info, bio: e.target.value })}
        />
        {Object.keys(social_accounts).map((soc_prof) => (
          <TextField
            label={soc_prof}
            value={social_accounts[soc_prof]}
            onChange={(e) =>
              setSocialAccounts({
                ...social_accounts,
                [soc_prof]: e.target.value,
              })
            }
          />
        ))}
      </form>
    </div>
  );
}

export default EditProfile;

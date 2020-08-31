import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo } from "../components/utils/getUserInfo";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileNavigation from "../components/Profile/ProfileNavigation";
const defaultProfile = {
  cover_photo: "",
  first_name: "",
  follow: "",
  last_name: "",
  profile_photo: "",
  social_profiles: {
    facebook: "",
    twitter: "",
    instagram: "",
  },
  username: "",
};

function Profile() {
  const [profile, setProfile] = useState(undefined);
  const [message, setMessage] = useState("");
  const profileId = useParams().profileId;
  useEffect(() => {
    let isRendered = true;
    const updateProfile = async () => {
      const user = await getUserInfo(profileId);
      if (isRendered) {
        if (user) {
          setProfile(user);
        } else {
          setMessage("profile not found");
        }
      }
    };
    if (profileId) {
      updateProfile();
    }
    return () => (isRendered = false);
  }, [profileId]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!profile) {
    return <div>Loading</div>;
  }
  const {
    cover_photo,
    first_name,
    follow,
    last_name,
    profile_photo,
    social_profiles,
    username,
  } = profile || defaultProfile;
  return (
    <Fragment>
      <ProfileHeader
        profile_photo={profile_photo}
        cover_photo={cover_photo}
        first_name={first_name}
        last_name={last_name}
        username={username}
        social_profiles={social_profiles}
      />
      <div style={{ maxWidth: "1024px", margin: "auto" }}>
        <ProfileNavigation
          follow={follow}
          profileId={profileId}
          profile={profile}
        />
      </div>
    </Fragment>
  );
}

export default Profile;

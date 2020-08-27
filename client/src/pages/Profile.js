import React, { useEffect, useState, Fragment } from "react";
import { getUserInfo } from "../components/utils/getUserInfo";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileNavigation from "../components/Profile/ProfileNavigation";

function Profile() {
  const [profile, setProfile] = useState({});
  const [profileId] = useState(
    window.location.pathname.replace("/profile/", "")
  );
  useEffect(() => {
    let isRendered = true;
    const updateProfile = async () => {
      const user = await getUserInfo(profileId);
      if (isRendered) {
        setProfile(user);
      }
    };
    if (profileId) {
      updateProfile();
    }
    return () => (isRendered = false);
  }, [profileId]);
  const {
    cover_photo,
    first_name,
    follow,
    last_name,
    profile_photo,
    social_profiles,
    username,
  } = profile;
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

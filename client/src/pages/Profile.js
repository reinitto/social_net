import React, { useEffect, useState } from "react";
import { getUserInfo } from "../components/utils/getUserInfo";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileNavigation from "../components/Profile/ProfileNavigation";

function Profile() {
  const [profile, setProfile] = useState({});
  const [profileId] = useState(
    window.location.pathname.replace("/profile/", "")
  );
  useEffect(() => {
    const updateProfile = async () => {
      const user = await getUserInfo(profileId);
      setProfile(user);
    };
    updateProfile();
  }, [profileId]);
  console.log("profile", profile);
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
    <div>
      <ProfileHeader
        profile_photo={profile_photo}
        cover_photo={cover_photo}
        first_name={first_name}
        last_name={last_name}
        username={username}
        social_profiles={social_profiles}
      />
      <ProfileNavigation
        follow={follow}
        profileId={profileId}
        profile={profile}
      />
    </div>
  );
}

export default Profile;

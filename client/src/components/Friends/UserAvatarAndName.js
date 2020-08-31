import React from "react";
import { Typography, Avatar } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

// user.profile_photo = user.profile_photo.replace(
//     "upload",
//     "upload/w_1000,h_1000,c_crop,g_face/w_100"
//   );

export function UserAvatarAndName({
  username = "",
  first_name = "",
  last_name = "",
  profile_photo = "",
  avatarClassNames = "",
  containerClassNames = "",
  textClassNames = "",
  children,
}) {
  const displayName =
    first_name || last_name || username
      ? first_name || last_name
        ? `${first_name} ${last_name} `
        : `${username}`
      : null;
  return (
    <div className={`${containerClassNames}`}>
      {profile_photo ? (
        <Avatar
          src={profile_photo}
          className={avatarClassNames}
          variant="circle"
        />
      ) : (
        <Skeleton variant="circle" className={avatarClassNames} />
      )}
      {displayName ? (
        <Typography display="inline" className={textClassNames}>
          {displayName}
        </Typography>
      ) : (
        <Skeleton variant="text" />
      )}
      {children}
    </div>
  );
}

export default UserAvatarAndName;

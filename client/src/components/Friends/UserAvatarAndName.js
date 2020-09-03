import React from "react";
import { Typography, Avatar, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import calculateDisplayName from "../utils/users/calculateDisplayName";
const useDefaultStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    margin: 8,
  },
}));
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
  const defaultClasses = useDefaultStyles();
  const displayName =
    first_name || last_name || username
      ? calculateDisplayName({
          username,
          first_name,
          last_name,
        })
      : null;
  return (
    <div className={containerClassNames || defaultClasses.container}>
      {profile_photo ? (
        <Avatar
          src={profile_photo}
          className={avatarClassNames || defaultClasses.avatar}
          variant="circle"
        />
      ) : (
        <Skeleton
          variant="circle"
          className={avatarClassNames || defaultClasses.avatar}
        />
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

import React, { Fragment, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { getUsersById } from "../../components/utils/users/getUsersById";
import { useUser } from "../../context/user";
import { PendingUserItem } from "./PendingUserItem";

export function PendingList() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const { friendPending } = useUser();
  useEffect(() => {
    let isRendered = true;
    if (friendPending > 0) {
      const getRequesters = async (ids) => {
        const { users, error } = await getUsersById(ids);
        if (isRendered) {
          if (error) {
            console.log(error);
          } else {
            setPendingUsers(users || []);
          }
        }
      };
      getRequesters(friendPending);
    }
    return () => (isRendered = false);
  }, [friendPending]);
  return (
    <Fragment>
      {pendingUsers && pendingUsers.length > 0 ? (
        <Typography variant="h5" align="center">
          Pending Requests
        </Typography>
      ) : null}
      {pendingUsers.map((user) => (
        <PendingUserItem key={user._id} user={user.recipient} />
      ))}
    </Fragment>
  );
}

export default PendingList;

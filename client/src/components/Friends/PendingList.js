import React, { Fragment, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { getUsersById } from "../../components/utils/users/getUsersById";
import { useUser } from "../../context/user";
import { PendingUserItem } from "./PendingUserItem";

export function PendingList() {
  const { friendPending } = useUser();
  return (
    <Fragment>
      {friendPending && friendPending.length > 0 ? (
        <Typography variant="h5" align="center">
          Pending Requests
        </Typography>
      ) : null}
      {friendPending.map((user) => (
        <PendingUserItem key={user._id} user={user.recipient} />
      ))}
    </Fragment>
  );
}

export default PendingList;

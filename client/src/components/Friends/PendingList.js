import React, { Fragment } from "react";
import { Typography } from "@material-ui/core";

import { PendingUserItem } from "./PendingUserItem";
export function PendingList({ users }) {
  return (
    <Fragment>
      {users && users.length > 0 ? (
        <Typography variant="h5" align="center">
          Pending Requests
        </Typography>
      ) : null}
      {users.map((user) => (
        <PendingUserItem key={user._id} user={user} />
      ))}
    </Fragment>
  );
}

export default PendingList;

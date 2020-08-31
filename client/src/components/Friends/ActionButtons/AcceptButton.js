import React, { useState, Fragment } from "react";
import { Button } from "@material-ui/core";
import acceptFriendRequest from "../../utils/friends/acceptFriendRequest";
import { ActionButtonSideMenu } from "./ActionButtonSideMenu";
import {
  acceptFriendButtonText,
  rejectFriendButtonText,
} from "../../../constants";

function AcceptButton({ friendId }) {
  const [buttonText, setButtonText] = useState([acceptFriendButtonText, ""]);
  const acceptRequest = async () => {
    const { error } = await acceptFriendRequest(friendId);
    if (error) {
      setButtonText(["Send Request Failed", "error"]);
      setTimeout(setButtonText([acceptFriendButtonText, ""]), 3000);
    } else {
      setButtonText(["friend request accepted", ""]);
    }
  };

  return (
    <Fragment>
      <Button onClick={acceptRequest}>{buttonText[0]}</Button>
      <ActionButtonSideMenu
        friendId={friendId}
        buttonText={rejectFriendButtonText}
      />
    </Fragment>
  );
}

export default AcceptButton;

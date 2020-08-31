import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import addFriend from "../../utils/friends/addFriend";
import { addFriendButtonTexts } from "../../../constants";

function AddButton({ friendId, requestSent = false }) {
  const [addText, requestedText] = addFriendButtonTexts;
  const [requestJustSent, setRequestJustSent] = useState(false);
  const [buttonText, setButtonText] = useState([addText, ""]);
  useEffect(() => {
    if (requestSent) {
      setButtonText([requestedText, ""]);
    }
  }, [requestSent, requestedText]);
  const sendFriendRequest = async () => {
    const { error } = await addFriend(friendId);
    if (error) {
      setButtonText(["Send Request Failed", "error"]);
      setTimeout(setButtonText([addText, ""]), 3000);
    } else {
      setButtonText([requestedText, ""]);
      setRequestJustSent(true);
    }
  };
  return (
    <Button
      disabled={requestSent || requestJustSent}
      onClick={sendFriendRequest}
      color={buttonText[1]}
    >
      {buttonText[0]}
    </Button>
  );
}

export default AddButton;

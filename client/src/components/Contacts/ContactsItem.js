import React, { useState, useEffect } from "react";
import { Button, makeStyles } from "@material-ui/core";
import { UserAvatarAndName } from "../Friends/UserAvatarAndName";
import { useUser } from "../../context/user";
import { useConversations } from "../../context/conversations";
import calculateDmId from "../utils/calculateDmId";
const useContactItemStyles = makeStyles((theme) => ({
  contactItemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

export function ContactsItem({ contact }) {
  const classes = useContactItemStyles();
  const { openChat, hasNewMessages } = useConversations();
  const { user } = useUser();
  const [chatId] = useState(calculateDmId(user.id, contact._id));
  const [newMessages, setNewMessages] = useState(false);

  useEffect(() => {
    setNewMessages(hasNewMessages(chatId));
  });
  //Onclick opens conversation
  const addConversation = () => {
    openChat(chatId);
  };
  console.log("newMessages", newMessages);
  return (
    <Button onClick={addConversation} className={classes.contactItemContainer}>
      <UserAvatarAndName
        {...contact}
        containerClassNames={classes.avatarContainer}
      />
      <div>{newMessages ? "new messages" : "no"}</div>
    </Button>
  );
}

export default ContactsItem;

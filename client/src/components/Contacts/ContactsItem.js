import React from "react";
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
  const { openChat } = useConversations();
  const { user } = useUser();
  //Onclick opens conversation
  const addConversation = () => {
    let chatId = calculateDmId(user.id, contact._id);
    openChat(chatId);
    //check conversation tab
    //if conversation id is in tab, open it
    // else
    //get conversation
    //add to conversation tab
    // open and focus
    console.log("chat added", chatId);
  };
  return (
    <Button onClick={addConversation} className={classes.contactItemContainer}>
      <UserAvatarAndName
        {...contact}
        containerClassNames={classes.avatarContainer}
      />
      <div>status</div>
    </Button>
  );
}

export default ContactsItem;

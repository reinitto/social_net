import React from "react";
import { Button, makeStyles } from "@material-ui/core";

import { UserAvatarAndName } from "../Friends/UserAvatarAndName";

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
  //Onclick opens conversation
  const openConversation = () => {
    //check conversation tab
    //if conversation id is in tab, open it
    // else
    //get conversation
    //add to conversation tab
    // open and focus
    console.log("open conversation clicked");
  };
  return (
    <Button onClick={openConversation} className={classes.contactItemContainer}>
      <UserAvatarAndName
        {...contact}
        containerClassNames={classes.avatarContainer}
      />
      <div>status</div>
    </Button>
  );
}

export default ContactsItem;

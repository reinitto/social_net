import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Button, Tooltip, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import ChatIcon from "@material-ui/icons/Chat";
import { UserAvatarAndName } from "../Friends/UserAvatarAndName";
import { useUser } from "../../context/user";
import { useConversations } from "../../context/conversations";
import calculateDmId from "../utils/calculateDmId";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const useContactItemStyles = makeStyles((theme) => {
  console.log(theme);
  return {
    contactItemContainer: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    chatButton: {
      display: "flex",
      alignItems: "center",
    },
    avatarContainer: {
      display: "inline-flex",
      alignItems: "center",
      position: "relative",
    },
    link: {
      display: "inline",
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    isOnlinedot: {
      height: 20,
      width: 20,
      backgroundColor: theme.palette.success.main,
      borderRadius: "50%",
      borderStyle: "solid",
      borderColor: "white",
      borderWidth: 2,
      display: "inline-block",
      position: "absolute",
      left: 3.5,
      top: 3.5,
      zIndex: 1000,
    },
  };
});

const useChatIconStyle = (newMessages) =>
  makeStyles((theme) => ({
    chatIcon: {
      margin: theme.spacing(0.5),
      padding: theme.spacing(1),
      color: theme.palette.common.white,
      boxSizing: "content-box",
      backgroundColor: newMessages
        ? theme.palette.error.light
        : theme.palette.primary.main,
      borderRadius: "50%",
      width: 10,
      height: 10,
    },
  }))();

export function ContactsItem({ contact }) {
  const classes = useContactItemStyles();
  const { openChat, hasNewMessages } = useConversations();
  const { userId } = useUser();
  const [chatId, setChatId] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [newMessages, setNewMessages] = useState(false);
  const chatIconClasses = useChatIconStyle(newMessages);
  const contactId = contact._id;
  useEffect(() => {
    if (userId && contactId) {
      setChatId(calculateDmId(userId, contactId));
      let now = dayjs();
      let last = dayjs(contact.last_online);
      // 5min in miliseconds
      let onlineTreshHold = 1000 * 60 * 5;
      setIsOnline(now.diff(last) < onlineTreshHold);
    }
  }, [userId, contactId]);
  useEffect(() => {
    if (chatId) {
      setNewMessages(hasNewMessages(chatId));
    }
  });
  //Onclick opens conversation
  const addConversation = () => {
    openChat(chatId);
  };
  return (
    <div className={classes.contactItemContainer}>
      <Link to={`/profile/${contact._id}`} className={classes.link}>
        <UserAvatarAndName
          {...contact}
          containerClassNames={classes.avatarContainer}
        >
          {isOnline ? <div className={classes.isOnlinedot}></div> : null}
        </UserAvatarAndName>
      </Link>
      <Tooltip title={newMessages ? "New messages" : "No new Messages"}>
        <Button onClick={addConversation} className={classes.chatButton}>
          <ChatIcon className={chatIconClasses.chatIcon} />
        </Button>
      </Tooltip>
    </div>
  );
}

export default ContactsItem;

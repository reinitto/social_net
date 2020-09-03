import React from "react";
import { makeStyles } from "@material-ui/core";
import { useConversations } from "../../context/conversations";
import Chat from "./Chat";

const useChatNavigationStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 275,
    display: "flex",
  },
  hidden: {
    height: 0,
  },
  visible: {
    height: "auto",
  },
}));

export function ChatsNavigation() {
  let { chats, addChat, removeChat } = useConversations();
  const classes = useChatNavigationStyles();
  console.log("chats", chats);
  // chats ids have to be checked, if a really long one its dm otherwise group
  return (
    <div
      className={`${classes.container} ${
        chats.length > 0 ? `${classes.visible}` : `${classes.hidden}`
      }`}
    >
      {chats.map((chat) => (
        <Chat key={chat} removeChat={removeChat} chatId={chat} />
      ))}
    </div>
  );
}

export default ChatsNavigation;

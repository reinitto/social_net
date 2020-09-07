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
  let { closeChat, messageRoom, directConversations } = useConversations();
  const classes = useChatNavigationStyles();
  // chats ids have to be checked, if a really long one its dm otherwise group
  console.log("directConversations", directConversations);
  const openChats = directConversations.filter((convo) => convo.open === true);
  console.log("openChats", openChats);
  return (
    <div
      className={`${classes.container} ${
        openChats.length > 0 ? `${classes.visible}` : `${classes.hidden}`
      }`}
    >
      {openChats.map((chat) => (
        <Chat
          key={chat.conversationId}
          closeChat={closeChat}
          chatId={chat.conversationId}
          messageRoom={messageRoom}
          messages={chat.messages}
        />
      ))}
    </div>
  );
}

export default ChatsNavigation;

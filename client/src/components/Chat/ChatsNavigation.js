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
  },
  hidden: {
    height: 0,
    overflow: "hidden",
  },
  visible: {
    height: 75,
    overflowY: "visible",
  },
}));

export function ChatsNavigation() {
  let {
    closeChat,
    messageRoom,
    directConversations,
    updateConversationMessages,
  } = useConversations();
  const classes = useChatNavigationStyles();
  // chats ids have to be checked, if a really long one its dm otherwise group
  const openChats = directConversations.filter((convo) => convo.open === true);
  return (
    <div
      className={`${classes.container} ${
        openChats.length > 0 ? `${classes.visible}` : `${classes.hidden}`
      }`}
    >
      {openChats.map((chat, i) => (
        <Chat
          i={i}
          key={chat.conversationId}
          chat={chat}
          closeChat={closeChat}
          chatId={chat.conversationId}
          messageRoom={messageRoom}
          messages={chat.messages}
          updateConversationMessages={updateConversationMessages}
        />
      ))}
    </div>
  );
}

export default ChatsNavigation;

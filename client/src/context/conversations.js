import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./user";
const ConversationsContext = createContext();

export default function ConversationsProvider({ children }) {
  const [chats, setChats] = useState([]);
  //   const [directConversations, setDirectConversations] = useState([]);
  //   const [groupConversations, setGroupConversations] = useState([]);
  const { user } = useUser();
  const addChat = (chatId) => {
    let newChats = chats.length > 0 ? [...chats, chatId] : [chatId];
    newChats = Array.from(new Set(newChats));
    setChats(newChats);
    // set local storage
    window.localStorage.setItem(
      user.id,
      JSON.stringify({
        activeChats: newChats,
      })
    );
  };
  const removeChat = (chatId) => {
    let newChats = chats.filter((id) => id !== chatId);
    newChats = newChats.length > 0 ? newChats : [];
    newChats = Array.from(new Set(newChats));

    setChats(newChats);
    //set local storage
    window.localStorage.setItem(
      user.id,
      JSON.stringify({
        activeChats: newChats,
      })
    );
  };
  // JSON.parse(window.localStorage.getItem('user'));
  // add to dms
  //   const addDirectConversation = (conversationId) => {
  //     setDirectConversations([...directConversations, conversationId]);
  //get directConversations
  // let currentDms = JSON.parse(
  //   window.localStorage.getItem("directConversations")
  // );
  // currentDms = currentDms
  //   ? currentDms.push(conversationId)
  //   : [conversationId];
  // // add to list
  // window.localStorage.setItem(
  //   JSON.stringify({ directConversations: currentDms })
  // );
  //   };

  //   //remove from dms
  //   const removeDirectConversation = (conversationId) => {
  //     let newDms = directConversations.filter((dmId) => dmId !== conversationId);
  //     //get directConversations
  //     let currentDms = JSON.parse(
  //       window.localStorage.getItem("directConversations")
  //     );
  //     currentDms = currentDms
  //       ? currentDms.filter((convoId) => convoId !== conversationId)
  //       : [];
  //     // add to list
  //     window.localStorage.setItem(
  //       JSON.stringify({ directConversations: currentDms })
  //     );
  //     setDirectConversations(newDms);
  //   };

  //   //add to group
  //   const addGroupConversation = (conversationId) => {
  //     setGroupConversations([...groupConversations, conversationId]);
  //     let currentGroupConversations = JSON.parse(
  //       window.localStorage.getItem("groupConversations")
  //     );
  //     currentGroupConversations = currentGroupConversations
  //       ? currentGroupConversations.push(conversationId)
  //       : [conversationId];
  //     // add to list
  //     window.localStorage.setItem(
  //       JSON.stringify({ groupConversations: currentGroupConversations })
  //     );
  //   };
  //   // remove grom froup convos
  //   const removeGroupConversation = (conversationId) => {
  //     let newDms = groupConversations.filter(
  //       (groupConversationId) => groupConversationId !== conversationId
  //     );
  //     setGroupConversations(newDms);
  //     //get groupConversations
  //     let groupConversationIds = JSON.parse(
  //       window.localStorage.getItem("groupConversations")
  //     );
  //     groupConversationIds = groupConversationIds
  //       ? groupConversationIds.filter((convoId) => convoId !== conversationId)
  //       : [];
  //     // add to list
  //     window.localStorage.setItem(
  //       JSON.stringify({ groupConversations: groupConversationIds })
  //     );
  //   };
  useEffect(() => {
    const getConversationsFromLocalStorage = async (userId) => {
      let localUserInfo = window.localStorage.getItem(userId);
      localUserInfo = localUserInfo ? JSON.parse(localUserInfo) : [];
      let activeChats = localUserInfo.activeChats;
      activeChats = activeChats ? activeChats : [];
      setChats(activeChats);
    };
    if (user) {
      getConversationsFromLocalStorage(user.id);
    }
  }, [user]);
  return (
    <ConversationsContext.Provider
      value={{
        chats,
        addChat,
        removeChat,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
export const useConversations = () => useContext(ConversationsContext);

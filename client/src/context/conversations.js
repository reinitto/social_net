import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import socketIOClient from "socket.io-client";
import { useUser } from "./user";
import submitDM from "../components/utils/message/submitDM";

const ConversationsContext = createContext();

export default function ConversationsProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [directConversations, setDirectConversations] = useState([]);
  const directConversationsRef = useRef(null);

  useEffect(() => {
    directConversationsRef.current = directConversations;
  });
  // const [groupConversations, setGroupConversations] = useState([]);
  const { user } = useUser();
  const addMessageToConversation = (data) => {
    const newConvos = directConversationsRef.current.map((convo) => {
      if (convo.conversationId === data.room) {
        const { content, sender, created } = data;
        convo.messages.push({ content, sender, created });
        return convo;
      } else {
        return convo;
      }
    });
    setDirectConversations(newConvos);
  };

  useEffect(() => {
    const setLocalStorageConversations = () => {
      //   // set local storage
      const openChats = directConversationsRef.current.filter(
        (convo) => convo.open === true
      );
      window.localStorage.setItem(
        user.id,
        JSON.stringify({
          activeChats: openChats,
        })
      );
    };

    if (user && user.id && !socket) {
      let socket = socketIOClient();
      setSocket(socket);
    }
    return () => {
      if (socket) {
        setLocalStorageConversations();
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    const joinRooms = ({ dms, socket }) => {
      let convoIds = dms.map((dm) => dm.conversationId);
      convoIds.forEach((id) => {
        socket.emit("join", id);
      });
    };
    const getConversationsFromLocalStorage = async ({ userId }) => {
      let localUserInfo = window.localStorage.getItem(userId);
      localUserInfo = localUserInfo ? JSON.parse(localUserInfo) : [];
      let activeChats = localUserInfo.activeChats;
      activeChats = activeChats ? activeChats : [];
      return activeChats.map((chat) => (chat = chat.conversationId));
    };

    const getDms = async (socket) => {
      const url = "/api/chat/direct/all";
      const res = await fetch(url);
      const { directConversations } = await res.json();
      let newDms = await getConversationsFromLocalStorage({
        userId: user.id,
      });
      let dmsWithOpenFlag = directConversations.map((dm) => ({
        ...dm,
        messages: [],
        open: newDms.includes(dm.conversationId) ? true : false,
      }));
      setDirectConversations(dmsWithOpenFlag);
      await joinRooms({ dms: directConversations, socket });
    };
    if (socket) {
      getDms(socket);
      socket.on("chat", addMessageToConversation);
    }
    return () => {
      if (socket) {
        socket.off("chat");
      }
    };
  }, [socket]);

  const directMessage = async ({ message, receiverId }) => {
    await submitDM({ text: message, receiverId });
  };

  const openChat = (chatId) => {
    // set open flag
    let newOpenChats = directConversationsRef.current.map((dm) => {
      if (dm.conversationId === chatId) {
        dm.open = true;
        return dm;
      } else {
        return dm;
      }
    });
    setDirectConversations(newOpenChats);
    let openChats = newOpenChats.filter((chat) => chat.open === true);
    openChats = Array.from(new Set(openChats));
    // set local storage
    window.localStorage.setItem(
      user.id,
      JSON.stringify({
        activeChats: openChats,
      })
    );
  };
  const closeChat = (chatId) => {
    // set open flag
    console.log(
      "directConversationsRef.current",
      directConversationsRef.current
    );
    let newOpenChats = directConversationsRef.current.map((dm) => {
      if (dm.conversationId === chatId) {
        dm.open = false;
        return dm;
      } else {
        return dm;
      }
    });
    console.log("newOpenChats", newOpenChats);
    setDirectConversations(newOpenChats);
    let openChats = newOpenChats.filter((chat) => chat.open === true);
    openChats = Array.from(new Set(openChats));
    // set local storage
    window.localStorage.setItem(
      user.id,
      JSON.stringify({
        activeChats: openChats,
      })
    );
  };

  return (
    <ConversationsContext.Provider
      value={{
        openChat,
        closeChat,
        messageRoom: directMessage,
        directConversations,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
export const useConversations = () => useContext(ConversationsContext);

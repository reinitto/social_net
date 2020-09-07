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
import getChatMessages from "../components/utils/message/getChatMessages";
const ConversationsContext = createContext();
export default function ConversationsProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [directConversations, setDirectConversations] = useState([]);
  const directConversationsRef = useRef(null);

  useEffect(() => {
    directConversationsRef.current = directConversations;
  });
  // const [groupConversations, setGroupConversations] = useState([]);
  const { userId, user } = useUser();
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
      const openChats = directConversationsRef.current.filter(
        (convo) => convo.open === true
      );
      if (userId) {
        window.localStorage.setItem(
          userId,
          JSON.stringify({
            activeChats: openChats,
          })
        );
      }
    };

    if (userId && !socket) {
      let socket = socketIOClient("/", {
        query: { userId },
      });
      setSocket(socket);

      socket.on("connect", () => {
        setSocketId(socket.id);
      });
      socket.on("chat", addMessageToConversation);
    }
    return () => {
      if (socket) {
        setLocalStorageConversations();
        socket.off("chat");
        socket.disconnect();
      }
    };
  }, [userId, socket]);

  useEffect(() => {
    let isRendered = true;
    const getConversationsFromLocalStorage = async ({ userId }) => {
      let localUserInfo = window.localStorage.getItem(userId);
      localUserInfo = localUserInfo ? JSON.parse(localUserInfo) : [];
      let activeChats = localUserInfo.activeChats;
      activeChats = activeChats ? activeChats : [];
      return activeChats.map((chat) => (chat = chat.conversationId));
    };

    const getDms = async () => {
      try {
        const url = "/api/chat/direct/all";
        const res = await fetch(url);
        const { directConversations } = await res.json();
        let newDms = await getConversationsFromLocalStorage({
          userId,
        });
        let dmsWithOpenFlag = directConversations.map((dm) => ({
          ...dm,
          messages: [],
          open: newDms.includes(dm.conversationId) ? true : false,
        }));
        if (isRendered) {
          setDirectConversations(dmsWithOpenFlag);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDms();

    return () => {
      isRendered = false;
    };
  }, [userId]);

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
      userId,
      JSON.stringify({
        activeChats: openChats,
      })
    );
  };
  const closeChat = (chatId) => {
    // set open flag
    let newOpenChats = directConversationsRef.current.map((dm) => {
      if (dm.conversationId === chatId) {
        dm.open = false;
        dm.messages = [];
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
      userId,
      JSON.stringify({
        activeChats: openChats,
      })
    );
  };

  const updateConversationMessages = async ({ chatId, limit, date, skip }) => {
    try {
      const { messages } = await getChatMessages({ chatId, limit, date, skip });
      let dm = directConversationsRef.current.map((convo) => {
        if (convo.conversationId === chatId) {
          convo.messages.push(...messages);
        }
        return convo;
      });
      setDirectConversations(dm);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ConversationsContext.Provider
      value={{
        openChat,
        closeChat,
        messageRoom: directMessage,
        directConversations,
        updateConversationMessages,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
export const useConversations = () => useContext(ConversationsContext);

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
import updateLastViewTime from "../components/utils/message/updateLastViewTime";
import getChatMessages from "../components/utils/message/getChatMessages";
const ConversationsContext = createContext();
export default function ConversationsProvider({ children }) {
  const { userId } = useUser();
  const [socket, setSocket] = useState(null);
  // const [socketId, setSocketId] = useState(null);
  const [directConversations, setDirectConversations] = useState([]);
  const directConversationsRef = useRef([]);

  useEffect(() => {
    directConversationsRef.current = directConversations;
  });
  // adds socket message to conversation
  // TODO : updates last message date
  // and last message viewed by logged in user
  // if received message is not from logged in user, update sender last viewed date
  const addMessageToConversation = (data) => {
    const newConvos = directConversationsRef.current.map((convo) => {
      if (convo.conversationId === data.room) {
        const { content, sender, created } = data;
        // find participant by sender id
        let newParticipants = convo.participants.map((participant) => {
          if (participant.user === sender._id) {
            if (sender._id === userId) {
              participant.last_viewed = created;
              return participant;
            } else {
              participant.last_viewed = created;
              return participant;
            }
          } else {
            return participant;
          }
        });
        // set participant last viewed to now if its logged in user
        // if its  other user use created date and update
        convo.participants = newParticipants;
        convo.messages.push({ content, sender, created });
        convo.last_message = created;
        return convo;
      } else {
        return convo;
      }
    });
    setDirectConversations(newConvos);
  };

  const disconnectSocket = () => {
    try {
      socket.off("chat");
      socket.disconnect();
    } catch (error) {
      console.log(error);
    }
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

    if (userId) {
      let socket = socketIOClient("/", {
        query: { userId },
      });
      setSocket(socket);

      // socket.on("connect", () => {
      //   setSocketId(socket.id);
      // });
      socket.on("chat", addMessageToConversation);
    }
    return () => {
      if (userId) {
        setLocalStorageConversations();
        setDirectConversations([]);
        directConversationsRef.current = null;
      }
    };
  }, [userId]);

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
    if (userId) {
      getDms();
    }

    return () => {
      isRendered = false;
    };
  }, [userId]);
  //sends message to server,saves in db and informs socketIO
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
  // gets messges from server and updates directMessages array which
  // is executed on Chat component init only
  const getInitialChatMessages = async ({ chatId, limit, date, skip }) => {
    try {
      const { messages, userViewDate } = await getChatMessages({
        chatId,
        limit,
        date,
        skip,
      });
      let dm = directConversationsRef.current.map((convo) => {
        if (convo.conversationId === chatId) {
          let user = convo.participants.find(
            (participant) => participant.user === userId
          );
          convo.messages.push(...messages);
          user.last_viewed = userViewDate;
        }
        return convo;
      });
      setDirectConversations(dm);
    } catch (error) {
      console.log(error);
    }
  };
  // checks if conversation has unread messages by logged in user
  const hasNewMessages = (conversationId) => {
    if (userId && directConversationsRef.current.length > 0) {
      let convo = directConversationsRef.current.find(
        (con) => con.conversationId === conversationId
      );
      let user = convo.participants.find(
        (participant) => participant.user === userId
      );
      if (user) {
        if (convo.last_message > user.last_viewed) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      console.log("no user or dms not loaded yet");
      return false;
    }
  };
  const setLastViewed = ({ conversationId }) => {
    let convos = directConversationsRef.current.map((con) => {
      if (con.conversationId === conversationId) {
        let user = con.participants.find(
          (participant) => participant.user === userId
        );
        const viewDate = Date.now();
        user.last_viewed = viewDate;
        // TODO: update last viewed serverSide
        updateLastViewTime({ conversationId, viewDate });
        return con;
      } else {
        return con;
      }
    });
    setDirectConversations(convos);
  };

  return (
    <ConversationsContext.Provider
      value={{
        openChat,
        closeChat,
        messageRoom: directMessage,
        directConversations,
        getInitialChatMessages,
        disconnectSocket,
        hasNewMessages,
        setLastViewed,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
export const useConversations = () => useContext(ConversationsContext);

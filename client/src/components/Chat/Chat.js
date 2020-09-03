import React, { useState, useEffect } from "react";
import "react-chat-elements/dist/main.css";
import {
  Accordion,
  AccordionSummary,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { MessageList } from "react-chat-elements";
import { useUser } from "../../context/user";
import getUserById from "../utils/users/getUsersById";
import submitDM from "../utils/message/submitDM";
import TextInputBox from "../TextInputBox";
import UserAvatarAndName from "../Friends/UserAvatarAndName";

const useChatStyles = makeStyles((theme) => ({
  container: {
    width: 250,
  },
  header: {
    height: 75,
  },
  messagesList: {
    height: 350,
  },
  input: {
    margin: 8,
    display: "flex",
  },
  submitButton: {
    margin: "10px 5px ",
  },
}));

function Chat({ removeChat, chatId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const classes = useChatStyles();
  const { user } = useUser();
  const [receiver, setReceiver] = useState({
    username: "",
    first_name: "",
    last_name: "",
    profile_photo: "",
  });
  const onMessageChange = (text) => {
    setMessage(text);
  };
  const onMessageSubmit = async () => {
    let receiverId = chatId.replace(user.id, "");
    //submit message
    const res = await submitDM({ text: message, receiverId });
    setMessage("");
  };

  useEffect(() => {
    // receiver info
    let isRendered = true;
    const getReceiverInfo = async () => {
      let receiverId = chatId.replace(user.id, "");
      const { users } = await getUserById([receiverId]);
      const { username, first_name, last_name, profile_photo } = users[0];
      if (isRendered) {
        setReceiver({ username, first_name, last_name, profile_photo });
      }
    };
    if (chatId) {
      getReceiverInfo();
    }
    return () => (isRendered = false);
  }, [chatId, user.id]);

  useEffect(() => {
    let isRendered = true;
    const getChatMessages = async (chatId) => {
      let isGroup = chatId.length > 24 ? false : true;
      const url = isGroup
        ? `/api/chat/group/message/${chatId}`
        : `/api/chat/direct/message/${chatId}`;
      const data = await fetch(url);
      if (isRendered) {
        const { messages, error } = await data.json();
        if (messages) {
          console.log("chat messages", messages);
          setMessages(messages);
        } else {
          console.log("error");
        }
      }
    };
    getChatMessages(chatId);
    return () => (isRendered = false);
  }, [chatId]);
  const closeChat = () => {
    removeChat(chatId);
  };
  console.log("receiver", receiver);
  return (
    <Accordion className={classes.container}>
      <AccordionSummary
        aria-label="Expand"
        aria-controls="additional-actions3-content"
        id="additional-actions3-header"
        className={classes.header}
      >
        <UserAvatarAndName {...receiver} />
        <IconButton onClick={closeChat}>
          <CloseIcon />
        </IconButton>
      </AccordionSummary>
      <MessageList
        className={classes.messagesList}
        lockable={false}
        toBottomHeight={"100%"}
        dataSource={messages.map((message) => {
          return {
            type: "text",
            text: message.content,
            date: new Date(message.created),
            position: message.sender == user.id ? "right" : "left",
          };
        })}
      />
      <TextInputBox
        onChangeText={onMessageChange}
        onSubmit={onMessageSubmit}
        text={message}
        submitButtonText="Send"
        InputContainerClasses={classes.input}
        submitButtonClasses={classes.submitButton}
      />
    </Accordion>
  );
}

export default Chat;

import React, { useState, useEffect, useRef } from "react";
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

function Chat({ closeChat, chatId, messageRoom, messages }) {
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
    await messageRoom({ room: chatId, message, receiverId });

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
  const removeChat = (e) => {
    e.stopPropagation();
    closeChat(chatId);
  };
  console.log("chat messages", messages);
  console.log("user.id", user.id);
  return (
    <Accordion className={classes.container}>
      <AccordionSummary
        aria-label="Expand"
        aria-controls="additional-actions3-content"
        id="additional-actions3-header"
        className={classes.header}
      >
        <UserAvatarAndName {...receiver} />
        <IconButton onClick={removeChat}>
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
            position: message.sender.id == user.id ? "right" : "left",
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

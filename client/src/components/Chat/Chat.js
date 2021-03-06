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

const containerInlineStyle = {
  margin: 0,
};

const useChatStyles = (itemCount) => {
  let style = makeStyles((theme) => {
    return {
      container: {
        width: 250,
        height: "auto",
        overflow: "visible",
        position: "absolute",
        bottom: 0,
        left: 250 * itemCount,
      },
      header: {
        height: 75,
      },
      messagesList: {
        height: 350,
      },
      myMessageItem: {
        "&>div": {
          backgroundColor: "#0083FE",
          color: "white",
          "&>svg": {
            fill: "#0083FE",
          },
        },
      },
      input: {
        margin: 8,
        display: "flex",
      },
      submitButton: {
        margin: "10px 5px ",
      },
    };
  });
  return style();
};

const defaultReceiver = {
  username: "",
  first_name: "",
  last_name: "",
  profile_photo: "",
};

// const ChatItem = (props) => {
//   console.log("props", props);
//   return <MessageBox {...props} className="message-box-class" />;
// };

function Chat({
  chat,
  closeChat,
  chatId,
  messageRoom,
  messages,
  getInitialChatMessages,
  setLastViewed,
  i,
}) {
  const [message, setMessage] = useState("");
  const classes = useChatStyles(i);
  const { user, userId, logoutUser } = useUser();
  const [receiver, setReceiver] = useState(defaultReceiver);
  const inputRef = useRef(null);
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
      let receiverId = chatId.replace(userId, "");
      const data = await getUserById([receiverId]);
      if (data.notAuthenticated) {
        logoutUser();
      } else {
        const { users } = data;
        const { username, first_name, last_name, profile_photo } = users[0];
        if (isRendered) {
          setReceiver({ username, first_name, last_name, profile_photo });
        }
      }
    };
    if (chatId) {
      getReceiverInfo();
    }
    return () => {
      setReceiver(defaultReceiver);
      isRendered = false;
    };
  }, [chatId, userId]);
  const removeChat = (e) => {
    e.stopPropagation();
    closeChat(chatId);
  };

  const onInputFocus = () => {
    setLastViewed({ conversationId: chatId });
  };

  const accordionExpandToggle = (e, expanded) => {
    // if accordion is being opened and there are currently no messages loaded in chat
    if (expanded && messages.length === 0) {
      const { last_message, participants } = chat;
      let last_viewed = null;
      let date = null;
      participants.forEach((participant) => {
        if (participant.user === user.id) {
          last_viewed = participant.last_viewed;
        }
      });
      if (last_message > last_viewed) {
        date = last_viewed;
      }
      getInitialChatMessages({ chatId, date });
    }
  };

  return (
    <Accordion
      className={classes.container}
      style={containerInlineStyle}
      onChange={accordionExpandToggle}
    >
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
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={messages.map((message, i) => {
          return {
            type: "text",
            text: message.content,
            date: new Date(message.created),
            position: message.sender._id === user.id ? "right" : "left",
            style: {
              color: "red",
            },
            className:
              message.sender._id === user.id ? classes.myMessageItem : "",
          };
        })}
      />
      <TextInputBox
        onChangeText={onMessageChange}
        onSubmit={onMessageSubmit}
        text={message}
        submitButtonText="Send"
        commentInputRef={inputRef}
        InputContainerClasses={classes.input}
        submitButtonClasses={classes.submitButton}
        inputProps={{ onFocus: onInputFocus }}
      />
    </Accordion>
  );
}

export default Chat;

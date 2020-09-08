const express = require("express");
const DirectMessage = require("../models/DirectMessage");
const DirectConversation = require("../models/DirectConversation");
const GroupConversation = require("../models/GroupConversation");
const GroupMessage = require("../models/GroupMessage");
const { direct_conversationId } = require("./utils/calculateConversationId");
const router = express.Router();
// const direct_conversationId = (userId, receiverId) => {
//   return `${receiverId}` > `${userId}`
//     ? `${receiverId}${userId}`
//     : `${userId}${receiverId}`;
// };
const userInConversation = async ({ userId, conversationId }) => {
  const isParticipant = await GroupConversation.findOne({
    _id: conversationId,
    participants: { $elemMatch: { $eq: userId } },
  });
  if (isParticipant) {
    return true;
  } else {
    return false;
  }
};
const isAdmin = async ({ userId, conversationId }) => {
  const isAdminOfChat = await GroupConversation.findOne({
    _id: conversationId,
    admin: userId,
  });
  if (isAdminOfChat) {
    return true;
  } else {
    return false;
  }
};

const updateLastViewed = async ({ conversationId, userId, date }) => {
  try {
    await DirectConversation.findOneAndUpdate(
      {
        conversationId,
        "participants.user": userId,
      },
      {
        $set: { "participants.$.last_viewed": date },
      }
    );
    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
};

const updateLastMessage = async ({ conversationId, date }) => {
  try {
    await DirectConversation.findOneAndUpdate(
      { conversationId },
      {
        $set: {
          last_message: date,
        },
      }
    );
  } catch (error) {
    console.log("update last viewed failed");
  }
};

module.exports = function () {
  // create group chat
  // router.post("/group/create", async (req, res) => {
  //   console.log("POST /group/create");
  //   if (!req.body || !req.body.chatName) {
  //     res.status(422).json({ error: "Missing required parameters" });
  //     return;
  //   }
  //   try {
  //     let { participantIds = [], chatName } = req.body;
  //     const { _id } = req.user;
  //     participantIds.push(_id);

  //     const groupNewConversation = new GroupConversation({
  //       admin: _id,
  //       participants: participantIds,
  //       name: chatName,
  //     });
  //     const save_res = await groupNewConversation.save();
  //     console.log("conversation created");
  //     console.log("sve res", save_res);
  //     return res.json({
  //       message: "conversation created",
  //       chatId: save.res._id,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error: "Group creation failed" });
  //   }
  // });
  // // add participants to group chat
  // router.post("/group/add_participant", async (req, res) => {
  //   if (!req.body || !req.body.newParticipantId || !req.body.groupChatId) {
  //     res.status(422).json({ error: "Missing required parameters" });
  //     return;
  //   }
  //   try {
  //     const { newParticipantId, groupChatId } = req.body;
  //     const { _id } = req.user;
  //     // check if user is part of conversation
  //     const userIsAuthorized = await userInConversation({
  //       userId: _id,
  //       conversationId: groupChatId,
  //     });
  //     console.log("userIsAuthorized", userIsAuthorized);
  //     if (userIsAuthorized) {
  //       await GroupConversation.findByIdAndUpdate(groupChatId, {
  //         $addToSet: { participants: newParticipantId },
  //       });
  //       res.json({ message: "participant added" });
  //     } else {
  //       throw new Error({ message: "User is not a part of the chat" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error: "Adding participant failed" });
  //   }
  // });
  // // remove self from chat
  // router.post("/group/remove_me", async (req, res) => {
  //   if (!req.body || !req.body.groupChatId) {
  //     res.status(422).json({ error: "Missing required parameters" });
  //     return;
  //   }
  //   try {
  //     const { groupChatId } = req.body;
  //     const { _id } = req.user;
  //     await GroupConversation.findByIdAndUpdate(groupChatId, {
  //       $pull: { participants: _id },
  //     });
  //     res.json({ message: "participant removed" });
  //     console.log("participant removed");
  //     return res.json({ message: "participant removed" });
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error: "Removing participant failed" });
  //   }
  // });
  // // remove participants from group chat
  // // as admin
  // router.post("/group/remove_participant", async (req, res) => {
  //   if (!req.body || !req.body.participantId || !req.body.groupChatId) {
  //     res.status(422).json({ error: "Missing required parameters" });
  //     return;
  //   }
  //   try {
  //     const { participantId, groupChatId } = req.body;
  //     const { _id } = req.user;
  //     // check if user is part of conversation
  //     const userIsAdmin = await isAdmin({
  //       userId: _id,
  //       conversationId: groupChatId,
  //     });
  //     if (userIsAdmin) {
  //       await GroupConversation.findByIdAndUpdate(groupChatId, {
  //         $pull: { participants: participantId },
  //       });
  //       res.json({ message: "participant removed" });
  //     } else {
  //       throw new Error({
  //         message: "User is not a part of the chat",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error: "Removing participant failed" });
  //   }
  // });
  // // add message to group chat
  // router.post("/group/message/add", async (req, res) => {
  //   if (!req.body || !req.body.groupChatId || !req.body.message) {
  //     res.status(422).json({ error: "Missing required parameters" });
  //     return;
  //   }
  //   try {
  //     const { groupChatId, message } = req.body;
  //     //   const { _id } = req.user;
  //     const _id = "5f3d81feb8192b4c9457a60a";
  //     //check if user is part of groupchat
  //     const isPartOfChat = await userInConversation({
  //       userId: _id,
  //       conversationId: groupChatId,
  //     });
  //     if (isPartOfChat) {
  //       // add message
  //       let newMessage = new GroupMessage({
  //         conversationId: groupChatId,
  //         sender: _id,
  //         content: message,
  //       });
  //       newMessage.save();
  //       res.json({ message: "message sent" });
  //     } else {
  //       throw new Error({
  //         message: "user not in chat",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error: "Group message failed" });
  //   }
  // });

  // // delete message from group chat
  // router.post("/group/message/remove", async (req, res) => {
  //   if (!req.body || !req.body.groupChatId || !req.body.messageId) {
  //     res.status(422).json({ error: "Missing required parameters" });
  //     return;
  //   }
  //   try {
  //     const { groupChatId, messageId } = req.body;
  //     const { _id } = req.user;
  //     //   const _id = "5f3d81feb8192b4c9457a60a";
  //     //check if user is part of groupchat
  //     const isPartOfChat = await userInConversation({
  //       userId: _id,
  //       conversationId: groupChatId,
  //     });
  //     if (isPartOfChat) {
  //       // add message
  //       await GroupMessage.findOneAndDelete({
  //         _id: messageId,
  //         sender: _id,
  //       });

  //       res.json({ message: "message deleted" });
  //     } else {
  //       throw new Error({
  //         message: "deleting message failed",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error: "action failed" });
  //   }
  // });

  // // get group chat messages
  // router.get("/group/message/:groupChatId", async (req, res) => {
  //   try {
  //     let { groupChatId } = req.params;
  //     let { _id } = req.user;
  //     // get all messages
  //     const isUserInChat = await userInConversation(_id, groupChatId);
  //     if (isUserInChat) {
  //       let messages = await GroupMessage.find({ conversationId: groupChatId });
  //       res.json({ chatMessages: messages });
  //     } else {
  //       res.json({ error: "user not in chat" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ error: "couldnt get messages" });
  //   }
  // });

  // create direct message
  router.post("/direct/message/add", async (req, res) => {
    if (!req.body || !req.body.receiverId || !req.body.message) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { message, receiverId } = req.body;
      const { username, first_name, last_name, profile_photo, id } = req.user;
      const conversationId = direct_conversationId(id, receiverId);
      const creationDate = Date.now();
      let newDirectMessage = new DirectMessage({
        direct_conversationId: conversationId,
        sender: id,
        content: message,
        created: creationDate,
      });
      const io = req.app.get("socketio");

      io.to(conversationId).emit("chat", {
        content: message,
        sender: { username, first_name, last_name, profile_photo, _id: id },
        room: conversationId,
        created: creationDate,
      });

      await newDirectMessage.save();
      // set directChat  last viewed to now
      await updateLastViewed({
        conversationId,
        userId: id,
        date: creationDate,
      });
      await updateLastMessage({ conversationId, date: creationDate });

      res.json({ message: "message added" });
    } catch (error) {
      console.log(error);
      res.json({ error: "coldnt add message" });
    }
  });

  // get direct messges
  router.post("/direct/message", async (req, res) => {
    if (!req.body || !req.body.chatId) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      let { chatId, count = 10, date } = req.body;
      const { _id } = req.user;
      chatId = chatId.replace(_id, "");
      const conversationId = direct_conversationId(_id, chatId);
      let messages = [];
      if (date) {
        messages = await DirectMessage.find(
          {
            direct_conversationId: conversationId,
            created: { $gt: date },
          },
          "sender content created _id"
        ).populate("sender");
      } else {
        messages = await DirectMessage.find(
          {
            direct_conversationId: conversationId,
          },
          "sender content created _id"
        )
          .sort("-created")
          .limit(count)
          .populate("sender");

        // reverse the order to have oldest message first
        messages = messages.reverse();
      }

      // // set directChat  last viewed to now.
      // either should be set here and loaded only on accordion open or should be its own route
      const viewDate = Date.now();
      await updateLastViewed({ conversationId, userId: _id, date: viewDate });
      res.json({ messages, userViewDate: viewDate });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "getting messges failed" });
    }
  });

  // get user directConversations
  router.get("/direct/all", async (req, res) => {
    try {
      const { _id: userId } = req.user;
      let dmChats = await DirectConversation.find({
        participants: { $elemMatch: { user: userId } },
      });
      res.json({ directConversations: dmChats });
    } catch (error) {
      console.log(error);
      res.status(400).send(new Error("getting direct chats failed"));
    }
  });

  return router;
};

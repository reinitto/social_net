const DirectMessage = require("../models/DirectMessage");

module.exports = function () {
  const express = require("express");
  const GroupConversation = require("../models/GroupConversation");
  const GroupMessage = require("../models/GroupMessage");
  const router = express.Router();

  const direct_conversationId = (userId, receiverId) => {
    return receiverId > userId
      ? `${receiverId}${userId}`
      : `${userId}${receiverId}`;
  };

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

  // create group chat
  router.post("/group/create", async (req, res) => {
    console.log("POST /group/create");
    if (!req.body || !req.body.chatName) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      let { participantIds = [], chatName } = req.body;
      const { _id } = req.user;
      participantIds.push(_id);

      const groupNewConversation = new GroupConversation({
        admin: _id,
        participants: participantIds,
        name: chatName,
      });
      const save_res = await groupNewConversation.save();
      console.log("conversation created");
      console.log("sve res", save_res);
      return res.json({
        message: "conversation created",
        chatId: save.res._id,
      });
    } catch (error) {
      console.log(error);
      res.json({ error: "Group creation failed" });
    }
  });
  // add participants to group chat
  router.post("/group/add_participant", async (req, res) => {
    if (!req.body || !req.body.newParticipantId || !req.body.groupChatId) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { newParticipantId, groupChatId } = req.body;
      const { _id } = req.user;
      // check if user is part of conversation
      const userIsAuthorized = await userInConversation({
        userId: _id,
        conversationId: groupChatId,
      });
      console.log("userIsAuthorized", userIsAuthorized);
      if (userIsAuthorized) {
        await GroupConversation.findByIdAndUpdate(groupChatId, {
          $addToSet: { participants: newParticipantId },
        });
        res.json({ message: "participant added" });
      } else {
        throw new Error({ message: "User is not a part of the chat" });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "Adding participant failed" });
    }
  });
  // remove self from chat
  router.post("/group/remove_me", async (req, res) => {
    if (!req.body || !req.body.groupChatId) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { groupChatId } = req.body;
      const { _id } = req.user;
      await GroupConversation.findByIdAndUpdate(groupChatId, {
        $pull: { participants: _id },
      });
      res.json({ message: "participant removed" });
      console.log("participant removed");
      return res.json({ message: "participant removed" });
    } catch (error) {
      console.log(error);
      res.json({ error: "Removing participant failed" });
    }
  });
  // remove participants from group chat
  // as admin
  router.post("/group/remove_participant", async (req, res) => {
    if (!req.body || !req.body.participantId || !req.body.groupChatId) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { participantId, groupChatId } = req.body;
      const { _id } = req.user;
      // check if user is part of conversation
      const userIsAdmin = await isAdmin({
        userId: _id,
        conversationId: groupChatId,
      });
      if (userIsAdmin) {
        await GroupConversation.findByIdAndUpdate(groupChatId, {
          $pull: { participants: participantId },
        });
        res.json({ message: "participant removed" });
      } else {
        throw new Error({
          message: "User is not a part of the chat",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "Removing participant failed" });
    }
  });
  // add message to group chat
  router.post("/group/message/add", async (req, res) => {
    if (!req.body || !req.body.groupChatId || !req.body.message) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { groupChatId, message } = req.body;
      //   const { _id } = req.user;
      const _id = "5f3d81feb8192b4c9457a60a";
      //check if user is part of groupchat
      const isPartOfChat = await userInConversation({
        userId: _id,
        conversationId: groupChatId,
      });
      if (isPartOfChat) {
        // add message
        let newMessage = new GroupMessage({
          conversationId: groupChatId,
          sender: _id,
          content: message,
        });
        newMessage.save();
        res.json({ message: "message sent" });
      } else {
        throw new Error({
          message: "user not in chat",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "Group message failed" });
    }
  });

  // delete message from group chat
  router.post("/group/message/remove", async (req, res) => {
    if (!req.body || !req.body.groupChatId || !req.body.messageId) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { groupChatId, messageId } = req.body;
      const { _id } = req.user;
      //   const _id = "5f3d81feb8192b4c9457a60a";
      //check if user is part of groupchat
      const isPartOfChat = await userInConversation({
        userId: _id,
        conversationId: groupChatId,
      });
      if (isPartOfChat) {
        // add message
        await GroupMessage.findOneAndDelete({
          _id: messageId,
          sender: _id,
        });

        res.json({ message: "message deleted" });
      } else {
        throw new Error({
          message: "deleting message failed",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "action failed" });
    }
  });

  // get group chat messages
  router.get("/group/message/:groupChatId", async (req, res) => {
    try {
      let { groupChatId } = req.params;
      let { _id } = req.user;
      // get all messages
      const isUserInChat = await userInConversation(_id, groupChatId);
      if (isUserInChat) {
        let messages = await GroupMessage.find({ conversationId: groupChatId });
        res.json({ chatMessages: messages });
      } else {
        res.json({ error: "user not in chat" });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "couldnt get messages" });
    }
  });

  // create direct message
  router.post("/direct/messaage/add", async (req, res) => {
    if (!req.body || !req.body.receiverId || !req.body.message) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { message, receiverId } = req.body;
      const { _id } = req.user;
      const conversationId = direct_conversationId(_id, receiverId);
      let newDirectMessage = new DirectMessage({
        direct_conversationId: conversationId,
        sender: _id,
        content: message,
      });
      await newDirectMessage.save();
      res.json({ message: "message added" });
    } catch (error) {
      console.log(error);
      res.json({ error: "coldnt add message" });
    }
  });

  // get direct messges
  router.get("/direct/message/:receiverId", async (req, res) => {
    try {
      const { receiverId } = req.params;
      const { _id } = req.user;
      const conversationId = direct_conversationId(_id, receiverId);
      const messages = await DirectMessage.find({
        direct_conversationId: conversationId,
      });
      res.json({ messages });
    } catch (error) {
      console.log(error);
      res.status(400).send(new Error("getting messages failed"));
    }
  });

  return router;
};

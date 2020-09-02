module.exports = function () {
  const express = require("express");
  const GroupConversation = require("../models/GroupConversation");
  const router = express.Router();

  const isUserInConversation = async ({ userId, conversationId }) => {
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
      //   const _id = "5f3d81feb8192b4c9457a60a";

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
      //   const _id = "5f3d81feb8192b4c9457a60a";
      // check if user is part of conversation
      const userIsAuthorized = await isUserInConversation({
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
        throw "User is not a part of the chat";
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
      //   const _id = "5f3d81feb8192b4c9457a60a";

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
      //   const _id = "5f3d81feb8192b4c9457a60a";
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
        throw "User is not a part of the chat";
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "Removing participant failed" });
    }
  });
  // add message to group chat
  router.post("/group/message", async (req, res) => {
    if (!req.body || !req.body.groupChatId) {
      res.status(422).json({ error: "Missing required parameters" });
      return;
    }
    try {
      const { groupChatId } = req.body;
      const { _id } = req.user;
      const isPartOfChat = await GroupConversation.findOne({
        _id: groupChatId,
        participants: { $elementMatch: _id },
      });

      //check if user is part of groupchat
    } catch (error) {
      console.log(error);
      res.json({ error: "Group message failed" });
    }
  });

  // delete message from group chat

  return router;
};

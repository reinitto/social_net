const direct_conversationId = (userId, receiverId) => {
  return `${receiverId}` > `${userId}`
    ? `${receiverId}${userId}`
    : `${userId}${receiverId}`;
};

module.exports = { direct_conversationId };

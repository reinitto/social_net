const calculateDmId = (userId, receiverId) => {
  return receiverId > userId
    ? `${receiverId}${userId}`
    : `${userId}${receiverId}`;
};

export default calculateDmId;

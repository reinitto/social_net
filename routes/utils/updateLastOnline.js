const User = require("../../models/User");

const update_last_online = async (userId) => {
  await User.findByIdAndUpdate(userId, { last_online: Date.now() });
  return;
};

module.exports = { update_last_online };

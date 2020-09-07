export const getChatMessages = async ({ date, limit, skip, chatId }) => {
  const url = "/api/chat/direct/message";
  const payload = {
    date,
    limit,
    skip,
    chatId,
  };
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const res = await fetch(url, options);
  return await res.json();
};

export default getChatMessages;

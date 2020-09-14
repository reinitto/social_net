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
  try {
    return await res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getChatMessages;

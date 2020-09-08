export const updateLastViewTime = async ({
  conversationId,
  viewDate = Date.now(),
}) => {
  const url = "/api/chat/direct/last_viewed";
  const payload = {
    conversationId,
    viewDate,
  };
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const res = await fetch(url, options);
  console.log(await res.json());
};

export default updateLastViewTime;

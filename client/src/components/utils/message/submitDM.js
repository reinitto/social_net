export const submitDM = async ({ receiverId, text, room }) => {
  const url = "/api/chat/direct/messaage/add";
  const payload = { receiverId, room, message: text };
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  let res = await fetch(url, options);
  return await res.json();
};

export default submitDM;

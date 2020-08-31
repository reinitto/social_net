export const getUsersById = async (ids) => {
  const url = "/api/user/getUsers";
  const payload = { userIds: ids };
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const data = await fetch(url, options);
  return await data.json();
};

export default getUsersById;

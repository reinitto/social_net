export const followUser = async (id) => {
  const url = "/api/user/follow";
  const payload = { target: id };
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  const res = await fetch(url, options);
  const { error, status } = await res.json();
  return { error, status };
};

export default followUser;

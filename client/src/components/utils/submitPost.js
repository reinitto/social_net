export let submitPost = async (postProps) => {
  const url = "/api/post/submit";
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...postProps }),
  };
  const res = await fetch(url, options);
  return await res.json();
};

export default submitPost;

export let submitPost = async ({ body, image }) => {
  const url = "/api/post/submit";
  const post = {
    body,
    image,
  };
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  };
  const res = await fetch(url, options);
  return await res.json();
};

export default submitPost;

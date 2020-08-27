export const addComment = async ({ text, postId, commentPath }) => {
  if (!text) return { error: "No text" };
  const url = "/api/post/comment";
  const payload = {
    content: {
      text,
    },
    postId,
    commentPath,
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

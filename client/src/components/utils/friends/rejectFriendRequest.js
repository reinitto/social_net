export const rejectFriendRequest = async (friendId) => {
  try {
    const url = `/api/friends/reject`;
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient: friendId }),
    };
    const rejectRes = await fetch(url, options);
    return await rejectRes.json();
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export default rejectFriendRequest;

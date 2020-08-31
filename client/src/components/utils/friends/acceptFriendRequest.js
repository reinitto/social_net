export const acceptFriendRequest = async (friendId) => {
  try {
    const url = `/api/friends/accept`;
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient: friendId }),
    };
    const friendAcceptRes = await fetch(url, options);
    return await friendAcceptRes.json();
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export default acceptFriendRequest;

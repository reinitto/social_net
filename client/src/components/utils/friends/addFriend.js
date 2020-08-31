export const addFriend = async (friendId) => {
  try {
    const url = `/api/friends/add`;
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient: friendId }),
    };
    const friendRequestRes = await fetch(url, options);
    return await friendRequestRes.json();
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export default addFriend;

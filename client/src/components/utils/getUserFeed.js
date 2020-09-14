export const getUserFeed = async (id) => {
  try {
    const url = new URL(window.location.origin + `/api/user/feed/${id}`);
    const userFeed = await fetch(url.href);
    return await userFeed.json();
  } catch (error) {
    console.log("getUserFeed failed", error);
    return [];
  }
};

export default getUserFeed;

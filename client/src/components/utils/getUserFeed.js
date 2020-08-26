export const getUserFeed = async (id) => {
  try {
    const url = new URL(window.location.origin + `/api/user/feed/${id}`);
    const userFeed = await fetch(url.href);
    const { feed } = await userFeed.json();
    return feed;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getUserFeed;

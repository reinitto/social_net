export const getUserInfo = async (id) => {
  try {
    const url = new URL(window.location.origin + `/api/user/${id}`);
    const authorInfo = await fetch(url.href);
    const { user } = await authorInfo.json();
    return user;
  } catch (error) {
    return { error };
  }
};

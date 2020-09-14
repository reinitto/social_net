export const getUserInfo = async (id) => {
  try {
    if (id) {
      const url = new URL(window.location.origin + `/api/user/${id}`);
      const authorInfo = await fetch(url.href);
      return authorInfo.json();
    }
  } catch (error) {
    console.log("getUSerInfo failed", error);
  }
};

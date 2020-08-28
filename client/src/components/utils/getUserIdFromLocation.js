export const getUserIdFromLocation = () => {
  return window.location.pathname.replace("/profile/", "");
};
export default getUserIdFromLocation;

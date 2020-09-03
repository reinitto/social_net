export const calculateDisplayName = ({ username, first_name, last_name }) => {
  return first_name || last_name ? `${first_name}${last_name}` : `${username}`;
};
export default calculateDisplayName;

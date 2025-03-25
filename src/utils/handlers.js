export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token;
};

export const loggedInUser = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return user;
};

export const clearToken = () => {
  return localStorage.removeItem("token");
};

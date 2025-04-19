export const setAuthToken = (token) => {
  localStorage.setItem("softools.auth.token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("softools.auth.token") || "";
};

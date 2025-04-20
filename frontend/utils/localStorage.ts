export const setAuthToken = (token: string) => {
  localStorage.setItem("softools.auth.token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("softools.auth.token") || "";
};

export const removeAuthToken = () => {
  localStorage.removeItem("softools.auth.token");
};

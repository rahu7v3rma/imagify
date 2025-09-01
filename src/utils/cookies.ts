import Cookies from 'js-cookie';

export const addCookie = ({ name, value }: { name: string; value: string }) => {
  Cookies.set(name, value);
};

export const deleteCookie = ({ name }: { name: string }) => {
  Cookies.remove(name);
};

export const saveAccessToken = ({ accessToken }: { accessToken: string }) => {
  addCookie({ name: 'imagify.access-token', value: accessToken });
};

export const getAccessToken = () => {
  return Cookies.get('imagify.access-token');
};

export const deleteAccessToken = () => {
  deleteCookie({ name: 'imagify.access-token' });
};

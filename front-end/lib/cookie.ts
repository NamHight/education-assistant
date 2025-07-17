import Cookies from 'js-cookie';
const cookieStorage = {
  get: (key: string): string | null => {
    return Cookies.get(key) || null;
  },
  set: (key: string, value: string, options?: Cookies.CookieAttributes, time?: number): void => {
    Cookies.set(
      key,
      value,
      options
        ? options
        : {
            path: '/',
            sameSite: 'lax',
            secure: window.location.protocol === 'https:',
            expires: time ? time : 1
          }
    );
  },
  remove: (key: string): void => {
    Cookies.remove(key, { path: '/' });
  }
};

export default cookieStorage;

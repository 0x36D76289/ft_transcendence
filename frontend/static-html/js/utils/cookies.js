export function setCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=None`;
}

export function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  for (let cookie of cookieArr) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.split('=')[1];
    }
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;Secure;SameSite=None`;
}

/* GET */

/* User */
export function getToken() {
  return getCookie('authToken');
}

export function getUsername() {
  return getCookie('username');
}

export function getBio() {
  return getCookie('bio');
}

/* Settings */
export function getLanguages() {
  return getCookie('languages') || 'en';
}

export function getTheme() {
  return getCookie('theme') || 'light';
}

export function getAccentColor() {
  return getCookie('accent') || document.documentElement.style.getPropertyValue('--accent-color') || '#3245ff';
}

/* SET */

/* User */
export function setToken(token) {
  setCookie('authToken', token);
}

export function setUsername(username) {
  setCookie('username', username);
}

export function setBio(bio) {
  setCookie('bio', bio);
}

/* Settings */
export function setLanguages(languages) {
  setCookie('languages', languages);
}

export function setTheme(theme) {
  setCookie('theme', theme);
}

export function setAccentColor(accent) {
  setCookie('accent', accent);
}

/* DELETE */

/* User */
export function deleteToken() {
  deleteCookie('authToken');
}

export function deleteUsername() {
  deleteCookie('username');
}

export function deleteBio() {
  deleteCookie('bio');
}

/* Settings */
export function deleteLanguages() {
  deleteCookie('languages');
}

export function deleteTheme() {
  deleteCookie('theme');
}

export function deleteAccentColor() {
  deleteCookie('accent');
}

export function deleteAllCookies() {
  deleteToken();
  deleteUsername();
  deleteBio();
  deleteLanguages();
  deleteTheme();
  deleteAccentColor();
}

export function setCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;Secure`;
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
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;Secure`;
}

export function getToken() {
  return getCookie('authToken');
}

export function getUsername() {
  return getCookie('username');
}

export function getBio() {
  return getCookie('bio');
}

export function setToken(token) {
  setCookie('authToken', token);
}

export function setUsername(username) {
  setCookie('username', username);
}

export function setBio(bio) {
  setCookie('bio', bio);
}

export function deleteToken() {
  deleteCookie('authToken');
}

export function deleteUsername() {
  deleteCookie('username');
}

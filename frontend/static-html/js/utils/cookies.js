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

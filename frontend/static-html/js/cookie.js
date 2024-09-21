/**
 * Creates a cookie with the specified name, value, and expiration days.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
export function createCookie(name, value, days) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toUTCString()}`;
	}
	document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

/**
 * Reads the value of a cookie by its name.
 * 
 * @param {string} name - The name of the cookie to read.
 * @returns {string|null} - The value of the cookie, or null if the cookie does not exist.
 */
export function readCookie(name) {
	const nameEQ = `${name}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/**
 * Erases a cookie by setting its expiration date to a past value.
 * @param {string} name - The name of the cookie to erase.
 */
export function eraseCookie(name) {
	document.cookie = `${name}=; Max-Age=-99999999;`;
}

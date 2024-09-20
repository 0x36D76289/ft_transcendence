/**
 * Utility function to get the value of a cookie by its name.
 * 
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The value of the cookie, or null if not found.
 */
export function getCookie(name) {
	let cookieValue = null;

	if (document.cookie && document.cookie !== "") {
		const cookies = document.cookie.split("; ");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			if (cookie.startsWith(name + "=")) {
				cookieValue = decodeURIComponent(cookie.split("=")[1]);
				break;
			}
		}
	}
	return cookieValue;
}

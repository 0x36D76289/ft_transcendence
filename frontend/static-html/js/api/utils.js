
const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Sends a POST request to the specified URL with the given data and optional CSRF token.
 *
 * @param {string} url - The endpoint URL to send the POST request to.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
export const postData = async (url = "", data = {}) => {
	const headers = {
		"Content-Type": "application/json",
	};

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(data),
	});

	console.log(response);

	// Check if the response is OK (status 200-299)
	if (!response.ok) {
		console.error(`HTTP error! status: ${response.status}`);
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};

/**
 * Fetches data from the specified URL with optional data and CSRF token.
 *
 * @param {string} url - The endpoint URL to fetch data from.
 * @returns {Promise<Object>} - A promise that resolves to the response data in JSON format.
 */
export const getData = async (url = "") => {
	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "GET",
	});

	if (!response.ok) {
		console.error(`HTTP error! status: ${response.status}`);
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	try {
		return await response.json();
	} catch (error) {
		console.error("Failed to parse JSON");
		throw new Error("Failed to parse JSON");
	}
};

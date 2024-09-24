const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Sends a POST request to the specified URL with the given data and optional CSRF token.
 *
 * @param {string} url - The endpoint URL to send the POST request to.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
export async function postData(url = "", data = {}) {
	const headers = {
		"Content-Type": "application/json",
	};

	console.log(`curl -X POST -H "Content-Type: application/json" -d '${JSON.stringify(data)}' ${API_BASE_URL}${url}`);

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(data),
	});

	const responseData = await response.json();

	console.log(responseData);

	return responseData;
}

/**
 * Fetches data from the specified URL with optional data and CSRF token.
 *
 * @param {string} url - The endpoint URL to fetch data from.
 * @returns {Promise<Object>} - A promise that resolves to the response data in JSON format.
 */
export async function getData(url = "") {
	console.log(`curl -X GET ${API_BASE_URL}${url}`);

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "GET",
	});

	const responseData = await response.json();

	console.log(responseData);

	return responseData;
}

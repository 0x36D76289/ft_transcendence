import { logMessage } from "../logs.js";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Sends a POST request to the specified URL with the given data and optional token.
 *
 * @param {string} url - The endpoint URL to send the POST request to.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @param {string|null} [token=null] - Optional authorization token to be included in the request headers.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
export const postData = async (url = "", data = {}, token = null) => {
	const headers = {
		"Content-Type": "application/json",
	};
	if (token) {
		headers["Authorization"] = `Token ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(data),
	});

	logMessage(`POST ${url} ${response.status}`, "info");

	return response.json();
};

/**
 * Fetches data from the specified URL with optional data and token.
 *
 * @param {string} url - The endpoint URL to fetch data from.
 * @param {Object} [data={}] - The data to be sent with the request.
 * @param {string|null} [token=null] - The optional authorization token.
 * @returns {Promise<Object>} - A promise that resolves to the response data in JSON format.
 */
export const getData = async (url = "", token = null) => {
	const headers = {};
	if (token) {
		headers["Authorization"] = `Token ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "GET",
		headers: headers,
	});

	if (!response.ok) {
		logMessage(`GET ${url} ${response.status}`, "error");
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	try {
		return await response.json();
	} catch (error) {
		logMessage(`GET ${url} failed to parse JSON`, "error");
		throw new Error("Failed to parse JSON");
	}
};

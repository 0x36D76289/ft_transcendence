import { logMessage } from "../logs.js";
import { getCookie } from "../cookie.js";

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
		"X-CSRFToken": getCookie("csrftoken"), // Protection CSRF
	};

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(data),
		credentials: "include",
	});

	logMessage(`POST ${url} ${response.status}`, "info");

	if (!response.ok) {
		logMessage(`POST ${url} failed with status ${response.status}`, "error");
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
	const headers = {
		"X-CSRFToken": getCookie("csrftoken"),
	};

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "GET",
		headers: headers,
		credentials: "include",
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
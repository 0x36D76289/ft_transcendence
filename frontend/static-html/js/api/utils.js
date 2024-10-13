const API_BASE_URL = "https://localhost/api";

function logCurlCommand(url, method, headers, body) {
	let curl = `curl -X ${method} "${API_BASE_URL}${url}"`;
	for (const [key, value] of Object.entries(headers)) {
		curl += ` -H "${key}: ${value}"`;
	}
	if (body) {
		curl += ` -d '${JSON.stringify(body)}'`;
	}
	console.log(curl);
}

export async function postData(url = "", headers = {}, body = {}) {
	logCurlCommand(url, "POST", headers, body);

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export async function getData(url = "", headers = {}) {
	logCurlCommand(url, "GET", headers);

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			...headers
		}
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

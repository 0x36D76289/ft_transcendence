const API_BASE_URL = "http://127.0.0.1:8000";

export async function postData(url = "", headers = {}, body = {}) {
	headers["Content-Type"] = "application/json";

	console.log(`curl -X POST -H "${JSON.stringify(headers)}" -d '${JSON.stringify(body)}' ${API_BASE_URL}${url}`);

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body),
	});

	const responseData = await response.json();

	console.log(responseData);

	return responseData;
}

export async function getData(url = "", headers = {}) {
	headers["Content-Type"] = "application/json";

	console.log(`curl -X GET -H "${JSON.stringify(headers)}" ${API_BASE_URL}${url}`);

	const response = await fetch(`${API_BASE_URL}${url}`, {
		method: "GET",
		headers: headers,
	});

	const responseData = await response.json();

	console.log(responseData);

	return responseData;
}

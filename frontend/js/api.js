async function apiRequest(url, method, body = null, headers = {}) {
	try {
		const response = await fetch(url, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				...headers
			},
			body: body ? JSON.stringify(body) : null,
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Something went wrong');
		}

		return response.json();
	} catch (error) {
		console.error('API request failed:', error);
		alert(error.message);
		throw error;
	}
}

export class API {
	constructor(baseURL) {
		this.baseURL = baseURL;
		this.token = null;
	}

	setToken(token) {
		this.token = token;
	}

	async request(endpoint, method = 'GET', body = null) {
		const url = `${this.baseURL}${endpoint}`;
		const headers = {
			'Content-Type': 'application/json',
		};

		if (this.token) {
			headers['Authorization'] = `Token ${this.token}`;
		}

		const options = {
			method,
			headers,
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	}

	async login(username, password) {
		const data = await this.request('/login', 'POST', { username, password });
		this.setToken(data.token);
		console.log('Logged in:', data);
		return data;
	}

	async signup(username, password) {
		console.log('Signing up:', username);
		return await this.request('/signup', 'POST', { username, password });
	}

	async logout() {
		await this.request('/logout', 'POST');
		console.log('Logged out');
		this.setToken(null);
	}
}

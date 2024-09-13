import {app} from "./app";

export class API {
	constructor(baseURL) {
		this.baseURL = baseURL;
		this.username = JSON.parse(localStorage.getItem('username')) || null;
		this.token = localStorage.getItem('token') || null;
	}

	getUserName() {
		return this.username;
	}

	isLoggedIn() {
		return !!this.token;
	}

	async _request(endpoint, method, body) {
		const headers = { 'Content-Type': 'application/json' };
		if (this.token) {
			headers['Authorization'] = `Token ${this.token}`;
		}

		const response = await fetch(`${this.baseURL}${endpoint}`, {
			method: method,
			headers: headers,
			body: body ? JSON.stringify(body) : null
		});
		return response.json();
	}

	async register(inputuser, inputpassword) {
		return this._request('/signup', 'POST', { username: inputuser, password: inputpassword });
	}

	async login(inputuser, inputpassword) {
		const data = await this._request('/login', 'POST', { username: inputuser, password: inputpassword });
		if (data.token) {
			this.token = data.token;
			this.username = inputuser;
			localStorage.setItem('token', this.token);
			localStorage.setItem('username', JSON.stringify(this.username));
		}
		return data;
	}

	logout() {
		this.token = null;
		this.username = null;
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		app.navigate('/');  // Navigate to home on logout
	}
}

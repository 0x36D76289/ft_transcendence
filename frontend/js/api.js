export class API {
	constructor(baseURL) {
		this.baseURL = baseURL;
		this.user = JSON.parse(localStorage.getItem('user')) || null;
		this.token = localStorage.getItem('token') || null;
	}

	getUser() {
		return this.user;
	}

	async register(inputuser, inputpassword) {
		const response = await fetch(`${this.baseURL}/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: inputuser, password: inputpassword })
		}).then(response => response.json()).then(data => console.log(data));

		return response;
	}

	async login(inputuser, inputpassword) {
		const response = await fetch(`${this.baseURL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: inputuser, password: inputpassword })
		});
		return response.json();
	}

	async logout(token) {
		const response = await fetch(`${this.baseURL}/logout`, {
			method: 'POST',
			headers: {
				'Authorization': `Token ${token}`
			}
		});
		return response.json();
	}
}

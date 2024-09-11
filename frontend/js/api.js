export class API {
	constructor() {
		this.token = null;
	}

	async register(username, password) {
		assert(!this.token, 'You are already logged in.');
		assert(username && password, 'Username and password are required.');

		try {
			const response = await fetch('http://127.0.0.1:8000/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			return response;
		} catch (error) {
			console.error('Registration failed:', error);
		}
	}

	async login(username, password) {
		assert(!this.token, 'You are already logged in.');
		assert(username && password, 'Username and password are required.');

		try {
			const response = await fetch('http://127.0.0.1:8000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			return response;
		} catch (error) {
			console.error('Login failed:', error);
		}
	}

	async logout() {
		assert(this.token, 'You are not logged in.');

		try {
			const response = await fetch('http://127.0.0.1:8000/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Token ${this.token}`
				}
			});

			return response;
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
}

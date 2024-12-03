import * as cookies from '../utils/cookies.js';
import { popupSystem } from '../services/popup.js';

const BASE_URL = 'https://' + window.location.host + '/api/user';

export class UserAPI {
	// Helper method to handle API responses
	static async _handleResponse(response) {
		const responseData = await response.json();
		console.log(responseData);
		if (!response.ok) {
			popupSystem('error', responseData.detail || 'An error occurred');
			throw new Error(responseData.detail || 'An error occurred');
		}
		return responseData;
	}

	// Helper method to get default headers
	static _getHeaders() {
		const token = cookies.getToken();
		return {
			'Content-Type': 'application/json',
			...(token && { 'Authorization': `Token ${token}` })
		};
	}

	// Login with username and password
	static async login(username, password) {
		const response = await fetch(`${BASE_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		const data = await this._handleResponse(response);

		cookies.setToken(data.token);
		cookies.setUsername(data.username);

		return data;
	}

	// Register a new user
	static async register(userData) {
		const response = await fetch(`${BASE_URL}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData)
		});

		return this._handleResponse(response);
	}

	// Create a guest account
	static async createGuestAccount() {
		const response = await fetch(`${BASE_URL}/create_guest`, {
			method: 'POST'
		});

		const data = await this._handleResponse(response);

		cookies.setToken(data.token);
		cookies.setUsername(data.username);

		return data;
	}

	// Logout
	static async logout() {
		const response = await fetch(`${BASE_URL}/logout`, {
			method: 'POST',
			headers: this._getHeaders()
		});

		const data = await this._handleResponse(response);

		cookies.deleteSessionCookies();

		return data;
	}

	// Update user profile
	static async updateProfile(updateData) {
		const response = await fetch(`${BASE_URL}/update_user`, {
			method: 'POST',
			headers: { 'Authorization': `Token ${cookies.getToken()}` },
			body: updateData
		});

		const newUsername = updateData.get('username');
		if (newUsername != undefined && response.ok) {
			cookies.setUsername(newUsername);
		}
		
		return this._handleResponse(response);
	}

	// Get user profile
	static async getProfile(username) {
		const response = await fetch(`${BASE_URL}/profile/${username}`, {
			method: 'GET',
			headers: this._getHeaders()
		});

		return this._handleResponse(response);
	}

	// Get user stats
	static async getUserStats(username) {
		const response = await fetch(`${BASE_URL}/stats/${username}`, {
			method: 'GET',
			headers: this._getHeaders()
		});

		return this._handleResponse(response);
	}

	// List recent users
	static async listUsers() {
		const response = await fetch(`${BASE_URL}/list`, {
			method: 'GET',
			headers: this._getHeaders()
		});

		return this._handleResponse(response);
	}

	// Friend-related methods
	static async sendFriendRequest(username) {
		const response = await fetch(`${BASE_URL}/send_friend_request`, {
			method: 'POST',
			headers: this._getHeaders(),
			body: JSON.stringify({ username })
		});

		return this._handleResponse(response);
	}

	static async removeFriendRequest(username) {
		const response = await fetch(`${BASE_URL}/remove_friend_request`, {
			method: 'POST',
			headers: this._getHeaders(),
			body: JSON.stringify({ username })
		});

		return this._handleResponse(response);
	}

	static async getFriendship(username) {
		const response = await fetch(`${BASE_URL}/get_friendship`, {
			method: 'GET',
			headers: this._getHeaders(),
			body: JSON.stringify({ username })
		});

		return this._handleResponse(response);
	}

	static async getFriends(username) {
		const response = await fetch(`${BASE_URL}/get_friends/${username}`, {
			method: 'GET',
			headers: this._getHeaders()
		});

		return this._handleResponse(response);
	}

	// Token validation
	static async isTokenValid(token) {
		const response = await fetch(`${BASE_URL}/is_token_valid`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token })
		});

		const data = await this._handleResponse(response);
		return data.detail === true;
	}

	// Delete user account
	static async delete_account() {
		const response = await fetch(`${BASE_URL}/delete_user`, {
			method: 'POST',
			headers: this._getHeaders()
		});

		cookies.deleteAllCookies();

		return this._handleResponse(response);
	}
}

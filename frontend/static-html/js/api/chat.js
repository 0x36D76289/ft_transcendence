import * as cookies from '../utils/cookies.js';
import { popupSystem } from '../services/popup.js';


const BASE_URL = `https://${window.location.hostname}/api`;

export class ChatAPI {
	// Helper method to handle API responses
	static async _handleResponse(response) {
		if (!response.ok) {
			const errorData = await response.json();
			popupSystem('error', errorData.detail || 'An error occurred');
			throw new Error(errorData.detail || 'An error occurred');
		}
		return response.json();
	}

	// Helper method to get default headers
	static _getHeaders() {
		const token = cookies.getToken();
		return {
			'Content-Type': 'application/json',
			...(token && { 'Authorization': `Token ${token}` })
		};
	}

	// Start a new conversation with a user
	static async startConversation(username) {
		const response = await fetch(`${BASE_URL}/chat/start`, {
			method: 'POST',
			headers: this._getHeaders(),
			body: JSON.stringify({ username })
		});

		return this._handleResponse(response);
	}

	// Get a specific conversation by ID
	static async getConversation(convoId) {
		const response = await fetch(`${BASE_URL}/chat/${convoId}`, {
			method: 'GET',
			headers: this._getHeaders()
		});

		return this._handleResponse(response);
	}

	// Get all conversations for the current user
	static async getConversations() {
		const response = await fetch(`${BASE_URL}/chat/conversations`, {
			method: 'GET',
			headers: this._getHeaders(),
		});

		return this._handleResponse(response);
	}

	// Block a user
	static async blockUser(username) {
		const response = await fetch(`${BASE_URL}/chat/block`, {
			method: 'POST',
			headers: this._getHeaders(),
			body: JSON.stringify({ username })
		});

		return this._handleResponse(response);
	}

	// Unblock a user
	static async unblockUser(username) {
		const response = await fetch(`${BASE_URL}/chat/unblock`, {
			method: 'POST',
			headers: this._getHeaders(),
			body: JSON.stringify({ username })
		});

		return this._handleResponse(response);
	}

	// Check if a user is blocked
	static async isUserBlocked(username) {
		const response = await fetch(`${BASE_URL}/chat/is_user_blocked`, {
			method: 'GET',
			headers: this._getHeaders()
		});

		const data = await this._handleResponse(response);
		return data.detail;
	}

	// Send a message (this method would need to be implemented on the backend)
	static async sendMessage(conversationId, messageContent) {
		const response = await fetch(`${BASE_URL}/chat/send_message`, {
			method: 'POST',
			headers: this._getHeaders(),
			body: JSON.stringify({
				conversation_id: conversationId,
				content: messageContent
			})
		});

		return this._handleResponse(response);
	}
}

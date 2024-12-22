import * as cookies from "../utils/cookies.js";
import { popupSystem } from "../services/popup.js";
import { API_URL } from "../app.js";
import { i18n } from "../services/i18n.js";

export class ChatAPI {
  static async _handleResponse(response) {
    const responseData = await response.json();
    console.log(responseData);
    if (!response.ok) {
      // popupSystem(
      //   "error",
      //   responseData.detail || i18n.t("notifications.error"),
      // );
      console.warn('API Error:', responseData);
      return;
    }
    return responseData;
  }

  static _getHeaders() {
    const token = cookies.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }),
    };
  }

  // Get conversation by ID
  static async getConversation(convo_id) {
    const response = await fetch(`${API_URL}/chat/${convo_id}`, {
      method: "GET",
      headers: this._getHeaders(),
    });

    return this._handleResponse(response);
  }

  // Get all conversations of the user
  static async getConversations() {
    const response = await fetch(`${API_URL}/chat/conversations`, {
      method: "GET",
      headers: this._getHeaders(),
    });

    return this._handleResponse(response);
  }

  // Start or get a conversation with another user
  static async startConversation(username) {
    const response = await fetch(`${API_URL}/chat/start`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ username }),
    });

    return this._handleResponse(response);
  }

  // Block a user
  static async blockUser(username) {
    const response = await fetch(`${API_URL}/chat/block`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ username }),
    });

    return this._handleResponse(response);
  }

  // Unblock a user
  static async unblockUser(username) {
    const response = await fetch(`${API_URL}/chat/unblock`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ username }),
    });

    return this._handleResponse(response);
  }

  // Check if a user is blocked
  static async isUserBlocked(username) {
    const response = await fetch(`${API_URL}/chat/is_user_blocked`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ username }),
    });

    return this._handleResponse(response);
  }
}

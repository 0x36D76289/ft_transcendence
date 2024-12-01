import * as cookies from '../utils/cookies.js';
import { popupSystem } from '../services/popup.js';

const BASE_URL = 'https://localhost:8443/api/game';

export class GameAPI {
  // Helper method to handle API responses (similar to UserAPI)
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

  // Get all game history
  static async getAllGameHistory() {
    const response = await fetch(`${BASE_URL}/history`, {
      method: 'GET',
      headers: this._getHeaders()
    });

    return this._handleResponse(response);
  }

  // Get game history for a specific user
  static async getUserGameHistory(username) {
    const response = await fetch(`${BASE_URL}/history/${username}`, {
      method: 'GET',
      headers: this._getHeaders()
    });

    return this._handleResponse(response);
  }

  // Create a new game
  static async createGame(gameData) {
    const response = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(gameData)
    });

    return this._handleResponse(response);
  }
}

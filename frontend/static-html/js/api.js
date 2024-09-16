import { navigate } from "./spa.js";
import { logMessage } from "./logs.js";

const baseURL = "http://127.0.0.1:8000/";

// User API
//    GET http://127.0.0.1/8000/user/profile/<username> Authorization: Token d43e9357b18d56959e1dbf30923f673438b55a9
//    POST http://127.0.0.1/8000/register Content-Type: application/json {"username": "<username>", "password": "<password>"}
//    POST http://127.0.0.1/8000/login Content-Type: application/json {"username": "<username>", "password": "<password>"}
//    POST http://127.0.0.1/8000/logout Authorization: Token d43e9357b18d56959e1dbf30923f673438b55a9

// Chat API
//    GET  http://127.0.0.1/chat/get/<username> Authorization: Token d43e9357b18d56959e1dbf30923f673438b55a9
//    GET http://127.0.0.1/chat/send/ Content-Type: application/json Authorization: Token d43e9357b18d56959e1dbf30923f673438b55a9 {"username": "<username>", "message": "<message>"}

// Game API
//    GET http://127.0.0.1/game/history (all games history)
//    GET  http://127.0.0.1/game/history/<username>

const handleError = (error) => {
  logMessage(`API Error: ${error.message}`);
};

const apiRequest = async (url, method, body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// User API
export const getUserProfile = async (username, token) => {
  return apiRequest(`${baseURL}user/profile/${username}`, "GET", null, token);
};

export const registerUser = async (username, password) => {
  return apiRequest(`${baseURL}user/register`, "POST", { username, password });
};

export const loginUser = async (username, password) => {
  return apiRequest(`${baseURL}user/login`, "POST", { username, password });
};

export const logoutUser = async (token) => {
  return apiRequest(`${baseURL}user/logout`, "POST", null, token);
};

// Chat API
export const getChatMessages = async (username, token) => {
  return apiRequest(`${baseURL}chat/get/${username}`, "GET", null, token);
};

export const sendChatMessage = async (username, message, token) => {
  return apiRequest(
    `${baseURL}chat/send/`,
    "GET",
    { username, message },
    token
  );
};

// Game API
export const getAllGamesHistory = async () => {
  return apiRequest(`${baseURL}game/history`, "GET");
};

export const getUserGameHistory = async (username) => {
  return apiRequest(`${baseURL}game/history/${username}`, "GET");
};

export const handleSuccessfulAction = (action, destination) => {
  logMessage(`${action} successful`);
  navigate(destination);
};

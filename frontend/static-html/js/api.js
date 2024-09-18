import { logMessage } from "./logs.js";

const API_BASE_URL = "http://127.0.0.1:8000/";

// Fonction pour gérer les requêtes POST
async function postData(url = "", data = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  logMessage(`POST ${url} ${response.status}`, "info");
  console.log(response);

  return response.json();
}

// Fonction pour gérer les requêtes GET
async function getData(url = "", token = null) {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "GET",
    headers: headers,
  });
  return response.json();
}

// Utilisateur : Inscription
async function registerUser(username, password) {
  return postData("/user/register", { username, password });
}

// Utilisateur : Connexion
async function loginUser(username, password) {
  return postData("/user/login", { username, password });
}

// Utilisateur : Déconnexion
async function logoutUser(token) {
  return postData("/user/logout", {}, token);
}

// Utilisateur : Profil
async function getUserProfile(username) {
  return getData(`/user/profile/${username}`);
}

// Utilisateur : Stats
async function getUserStats(username) {
  return getData(`/user/stats/${username}`);
}

// Utilisateur : Envoyer une demande d'ami
async function sendFriendRequest(username, token) {
  return postData("/user/send_friend_request", { username }, token);
}

// Utilisateur : Retirer une demande d'ami ou supprimer un ami
async function removeFriendRequest(username, token) {
  return postData("/user/remove_friend_request", { username }, token);
}

// Utilisateur : Obtenir le statut d'amitié
async function getFriendshipStatus(username, token) {
  return postData("/user/get_friendship", { username }, token);
}

// Jeu : Historique général des parties
async function getGameHistory() {
  return getData("/game/history");
}

// Jeu : Historique des parties d'un utilisateur
async function getUserGameHistory(username) {
  return getData(`/game/history/${username}`);
}

// Chat : Obtenir l'historique de chat
async function getChatHistory(username, token) {
  return getData(`/chat/get/${username}`, token);
}

// Chat : Envoyer un message
async function sendMessage(username, message, token) {
  return postData(`/chat/get/${username}`, { username, message }, token);
}

// Chat : Bloquer un utilisateur
async function blockUser(username, token) {
  return postData("/chat/block", { username }, token);
}

// Chat : Débloquer un utilisateur
async function unblockUser(username, token) {
  return postData("/chat/unblock", { username }, token);
}

// Chat : Vérifier si un utilisateur est bloqué
async function isUserBlocked(username, token) {
  return getData(`/chat/is_user_blocked`, token);
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserStats,
  sendFriendRequest,
  removeFriendRequest,
  getFriendshipStatus,
  getGameHistory,
  getUserGameHistory,
  getChatHistory,
  sendMessage,
  blockUser,
  unblockUser,
  isUserBlocked,
};

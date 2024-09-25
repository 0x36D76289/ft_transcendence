import { postData, getData } from "./utils.js";
import { readCookie, createCookie, eraseCookie } from "../cookie.js";

/**
 * Registers a new user.
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} bio - Optional user bio.
 * @returns {Promise<Object>} - The response data from the API.
 */
export async function registerUser(username, password, bio = "") {
	const body = { username, password, bio };
	return await postData("/user/register", {}, body);
}

/**
* Logs in a user and stores the token in a cookie.
* @param {string} username - The username of the user.
* @param {string} password - The password of the user.
* @returns {Promise<Object>} - The response data from the API, including token.
*/
export async function loginUser(username, password) {
	const body = { username, password };
	const response = await postData("/user/login", {}, body);

	if (response.token) {
		createCookie("authToken", response.token, 7);
	}

	return response;
}

/**
* Logs out the user and clears the authentication token.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function logoutUser() {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	const response = await postData("/user/logout", headers);

	eraseCookie("authToken"); // Clear token from cookies
	return response;
}

/**
* Checks if the stored token is still valid.
* @returns {Promise<Object>} - The response data from the API, including user details if valid.
*/
export async function isTokenValid() {
	const token = readCookie("authToken");
	const body = { token };
	return await postData("/user/is_token_valid", {}, body);
}

/**
* Updates the user information.
* @param {string} username - The new username of the user.
* @param {string} bio - The new bio of the user.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function updateUser(username, bio = "") {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	const body = { username, bio };
	return await postData("/user/update_user", headers, body);
}

/**
* Gets the public profile of a user.
* @param {string} username - The username of the user to fetch.
* @returns {Promise<Object>} - The response data from the API, including profile details.
*/
export async function getUserProfile(username) {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	return await getData(`/user/profile/${username}`, headers);
}

/**
* Gets the game stats of a user.
* @param {string} username - The username of the user to fetch stats for.
* @returns {Promise<Object>} - The response data from the API, including game stats.
*/
export async function getUserStats(username) {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	return await getData(`/user/stats/${username}`, headers);
}

/**
* Lists the last 20 registered users.
* @returns {Promise<Array>} - The response data from the API, including a list of users.
*/
export async function listUsers() {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	return await getData("/user/list", headers);
}

/**
* Sends or accepts a friend request to/from another user.
* @param {string} username - The username of the target user.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function sendFriendRequest(username) {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	const body = { username };
	return await postData("/user/send_friend_request", headers, body);
}

/**
* Removes a friend request or unfriends a user.
* @param {string} username - The username of the target user.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function removeFriendRequest(username) {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	const body = { username };
	return await postData("/user/remove_friend_request", headers, body);
}

/**
* Gets the friendship status between the logged-in user and another user.
* @param {string} username - The username of the target user.
* @returns {Promise<Object>} - The response data from the API, including friendship status.
*/
export async function getFriendshipStatus(username) {
	const token = readCookie("authToken");
	const headers = { Authorization: `Token ${token}` };
	const body = { username };
	return await postData("/user/get_friendship", headers, body);
}
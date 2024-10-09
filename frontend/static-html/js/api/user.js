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
	return await postData("/user/register", {}, { username, password, bio });
}

/**
* Logs in a user and stores the token in a cookie.
* @param {string} username - The username of the user.
* @param {string} password - The password of the user.
* @returns {Promise<Object>} - The response data from the API, including token.
*/
export async function loginUser(username, password) {
	const response = await postData("/user/login", {}, { username, password });

	if (response.token) {
		createCookie("token", response.token, 7);
		createCookie("username", username, 7);
	}

	return response;
}

/**
* Logs out the user and clears the authentication token.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function logoutUser() {
	const response = await postData("/user/logout", { Authorization: `Token ${readCookie("token")}` });

	eraseCookie("token");
	return response;
}

/**
* Checks if the stored token is still valid.
* @returns {Promise<Object>} - The response data from the API, including user details if valid.
*/
export async function isTokenValid() {
	return await postData("/user/is_token_valid", {}, { token: readCookie("token") });
}

/**
* Updates the user information.
* @param {string} username - The new username of the user.
* @param {string} bio - The new bio of the user.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function updateUser(username, bio = "") {
	return await postData("/user/update_user", { Authorization: `Token ${readCookie("token")}` }, { username, bio });
}

/**
* Deletes the user.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function deleteUser() {
	return await postData("/user/delete_user", { Authorization: `Token ${readCookie("token")}` });
}

/**
* Creates a guest user.
* @returns {Promise<Object>} - The response data from the API, including token and username.
*/
export async function createGuest() {
	const response = await postData("/user/create_guest", {});

	if (response.token) {
		createCookie("token", response.token, 7);
		createCookie("username", response.username, 7);
		console.log(response.detail);
	}

	return response;
}

/**
* Gets the public profile of a user.
* @param {string} username - The username of the user to fetch.
* @returns {Promise<Object>} - The response data from the API, including profile details.
*/
export async function getUserProfile(username) {
	return await getData(`/user/profile/${username}`, { Authorization: `Token ${readCookie("token")}` });
}

/**
* Gets the game stats of a user.
* @param {string} username - The username of the user to fetch stats for.
* @returns {Promise<Object>} - The response data from the API, including game stats.
*/
export async function getUserStats(username) {
	return await getData(`/user/stats/${username}`, { Authorization: `Token ${readCookie("token")}` });
}

/**
* Lists the last 20 registered users.
* @returns {Promise<Array>} - The response data from the API, including a list of users.
*/
export async function listUsers() {
	return await getData("/user/list", { Authorization: `Token ${readCookie("token")}` });
}

/**
* Sends or accepts a friend request to/from another user.
* @param {string} username - The username of the target user.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function sendFriendRequest(username) {
	return await postData("/user/send_friend_request", { Authorization: `Token ${readCookie("token")}` }, { username });
}

/**
* Removes a friend request or unfriends a user.
* @param {string} username - The username of the target user.
* @returns {Promise<Object>} - The response data from the API.
*/
export async function removeFriendRequest(username) {
	return await postData("/user/remove_friend_request", { Authorization: `Token ${readCookie("token")}` }, { username });
}

/**
* Gets the friendship status between the logged-in user and another user.
* @param {string} username - The username of the target user.
* @returns {Promise<Object>} - The response data from the API, including friendship status.
*/
export async function getFriendshipStatus(username) {
	return await getData("/user/get_friendship", { Authorization: `Token ${readCookie("token")}` }, { username });
}

/**
* Gets the friends of a user.
* @param {string} username - The username of the user to fetch friends for.
* @returns {Promise<Array>} - The response data from the API, including a list of friends.
*/
export async function getFriends(username) {
	return await getData("/user/get_friends", { Authorization: `Token ${readCookie("token")}` }, { username });
}

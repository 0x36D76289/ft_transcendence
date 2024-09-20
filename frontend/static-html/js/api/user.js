import { postData, getData } from "./utils.js";

// User APIs

/**
 * Registers a new user.
 * 
 * @function registerUser
 * @param {string} username - The username of the new user.
 * @param {string} password - The password for the new user.
 * @param {string} [bio=''] - An optional bio for the new user.
 * @returns {Promise<Object>} The response object containing `detail` and `username` when successful.
 * 
 * @description
 * Sends a POST request to the `/user/register` endpoint to register a new user.
 * 
 * @example
 * registerUser('newUser', 'password123', 'This is a bio.')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const registerUser = (username, password, bio = '') => {
	return postData("/user/register", { username, password, bio });
};

/**
 * Logs in a user.
 * 
 * @function loginUser
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} The response object containing `token` and `username` when successful.
 * 
 * @description
 * Sends a POST request to the `/user/login` endpoint to log in a user.
 * 
 * @example
 * loginUser('existingUser', 'password123')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const loginUser = (username, password) => {
	return postData("/user/login", { username, password });
};

/**
 * Logs out a user.
 * 
 * @function logoutUser
 * @param {string} token - The authentication token of the user.
 * @returns {Promise<Object>} The response object containing `detail` when successful.
 * 
 * @description
 * Sends a POST request to the `/user/logout` endpoint to log out a user, deleting and invalidating the existing authentication token.
 * 
 * @example
 * logoutUser('authToken123')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const logoutUser = (token) => {
	return postData("/user/logout", {}, token);
};

/**
 * Updates user information.
 * 
 * @function updateUser
 * @param {string} token - The authentication token of the user.
 * @param {string} username - The new username of the user.
 * @param {string} [bio] - The new bio of the user.
 * @returns {Promise<Object>} The response object containing `detail` when successful.
 * 
 * @description
 * Sends a POST request to the `/user/update_user` endpoint to update user information.
 * 
 * @example
 * updateUser('authToken123', 'newUsername', 'This is a new bio.')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const updateUser = (token, username, bio) => {
	return postData("/user/update_user", { username, bio }, token);
};

/**
 * Gets the public profile of a user.
 * 
 * @function getUserProfile
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} The response object containing `id`, `username`, `bio`, `date_joined`, `is_online`, and `last_online` when successful.
 * 
 * @description
 * Sends a GET request to the `/user/profile/${username}` endpoint to get public information of a user.
 * 
 * @example
 * getUserProfile('existingUser')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getUserProfile = (username) => {
	return getData(`/user/profile/${username}`);
};

/**
 * Gets the public game stats of a user.
 * 
 * @function getUserStats
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} The response object containing `games_played` and `win_rate` when successful.
 * 
 * @description
 * Sends a GET request to the `/user/stats/${username}` endpoint to get public game stats of a user.
 * 
 * @example
 * getUserStats('existingUser')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getUserStats = (username) => {
	return getData(`/user/stats/${username}`);
};

/**
 * Sends a friend request to another user.
 * 
 * @function sendFriendRequest
 * @param {string} token - The authentication token of the user.
 * @param {string} username - The username of the target user.
 * @returns {Promise<Object>} The response object containing `detail` when successful.
 * 
 * @description
 * Sends a POST request to the `/user/send_friend_request` endpoint to send a friend request to another user. If the target user has already sent a friend request, you will become friends.
 * 
 * @example
 * sendFriendRequest('authToken123', 'targetUser')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const sendFriendRequest = (token, username) => {
	return postData("/user/send_friend_request", { username }, token);
};

/**
 * Removes a friend request or friendship.
 * 
 * @function removeFriendRequest
 * @param {string} token - The authentication token of the user.
 * @param {string} username - The username of the target user.
 * @returns {Promise<Object>} The response object containing `detail` when successful.
 * 
 * @description
 * Sends a POST request to the `/user/remove_friend_request` endpoint to either remove a friend request you made to this user, decline a friend request the user made to you, or remove friendship if you are already friends.
 * 
 * @example
 * removeFriendRequest('authToken123', 'targetUser')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const removeFriendRequest = (token, username) => {
	return postData("/user/remove_friend_request", { username }, token);
};

/**
 * Gets the friendship information about a user.
 * 
 * @function getFriendship
 * @param {string} token - The authentication token of the user.
 * @param {string} username - The username of the target user.
 * @returns {Promise<Object>} The response object containing `detail` when successful.
 * 
 * @description
 * Sends a POST request to the `/user/get_friendship` endpoint to get the friendship information about a user. Returns FRIEND if you are friends, REQ_SENT if you sent a friend request to this user, REQ_RECEIVED if you received a friend request from this user, else returns NONE.
 * 
 * @example
 * getFriendship('authToken123', 'targetUser')
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export const getFriendship = (token, username) => {
	return postData("/user/get_friendship", { username }, token);
};

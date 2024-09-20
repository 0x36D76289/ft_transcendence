import { postData, getData } from "./utils.js";

// Chat APIs
/**
 * Fetches the chat history with another user.
 *
 * @function
 * @name getChatHistory
 * @param {string} token - The authorization token to be included in the request header.
 * @param {string} username - The username of the other user to get the chat history with.
 * @returns {Promise<Object[]>} A promise that resolves to a list of messages, each containing:
 * - `sender` {string}: The sender of the message.
 * - `receiver` {string}: The receiver of the message.
 * - `content` {string}: The content of the message.
 * - `time_created` {string}: The time the message was created.
 */
export const getChatHistory = (token, username) => {
	return getData(`/chat/get/${username}`, token);
};

/**
 * Sends a message to another user.
 *
 * @function
 * @name sendMessage
 * @param {string} token - The authorization token to be included in the request header.
 * @param {string} username - The username of the other user to send the message to.
 * @param {string} message - The content of the message to be sent.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 * - `detail` {string}: The detail of the response.
 */
export const sendMessage = (token, username, message) => {
	return postData(`/chat/get/${username}`, { username, message }, token);
};

/**
 * Blocks another user.
 *
 * @function
 * @name blockUser
 * @param {string} token - The authorization token to be included in the request header.
 * @param {string} username - The username of the user to be blocked.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 * - `detail` {string}: The detail of the response.
 */
export const blockUser = (token, username) => {
	return postData("/chat/block", { username }, token);
};

/**
 * Unblocks another user.
 *
 * @function
 * @name unblockUser
 * @param {string} token - The authorization token to be included in the request header.
 * @param {string} username - The username of the user to be unblocked.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 * - `detail` {string}: The detail of the response.
 */
export const unblockUser = (token, username) => {
	return postData("/chat/unblock", { username }, token);
};

/**
 * Checks if a user is blocked.
 *
 * @function
 * @name isUserBlocked
 * @param {string} token - The authorization token to be included in the request header.
 * @param {string} username - The username of the user to check.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 * - `detail` {boolean}: True if the user is blocked, false otherwise.
 */
export const isUserBlocked = (token, username) => {
	return postData(`/chat/is_user_blocked`, { username }, token);
};

/**
 * Debug endpoint to manually create messages.
 *
 * @function
 * @name debugCreateMessage
 * @param {string} token - The authorization token to be included in the request header.
 * @param {string} username - The username of the other user to send the message to.
 * @param {string} message - The content of the message to be created.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 * - `detail` {string}: The detail of the response.
 */
export const debugCreateMessage = (token, username, message) => {
	return postData(`/chat/debug`, { username, message }, token);
};
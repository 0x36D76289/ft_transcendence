import { get, post } from './api.js';

export const UserAPI = {
	register: async (username, password, bio = '') => {
		const data = await post('/user/register', { username, password, bio });
		setCookie('authToken', data.token);
		return data;
	},

	login: async (username, password) => {
		const data = await post('/user/login', { username, password });
		setCookie('authToken', data.token);
		return data;
	},

	logout: async () => {
		const data = await post('/user/logout');
		deleteCookie('authToken');
		return data;
	},

	isTokenValid: () => post('/user/is_token_valid', { token: getToken() }),

	getProfile: (username) => get(`/user/profile/${username}`),
	updateUser: (username, bio) => post('/user/update_user', { username, bio }),
	deleteUser: () => post('/user/delete_user'),
	createGuest: () => {
		post('/user/create_guest');
		setCookie('authToken', 'guest');
	},
	getProfile: (token, username) => get(`/user/profile/${username}`, token),
	getStats: (token, username) => get(`/user/stats/${username}`, token),
	listUsers: (token) => get('/user/list', token),
	sendFriendRequest: (token, username) => post('/user/send_friend_request', { username }, token),
	removeFriendRequest: (token, username) => post('/user/remove_friend_request', { username }, token),
	getFriendship: (token, username) => get(`/user/get_friendship`, token),
	getFriends: (token, username) => get(`/user/get_friends`, token),
};

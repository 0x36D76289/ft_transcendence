import { get, post } from './api.js';
import { deleteAllCookies, getToken, setToken } from '../utils/cookies.js';

export const UserAPI = {
	register: async (username, password, bio = '') => {
		const data = await post('/user/register', { username, password, bio });
		setToken(data.token);
		return data;
	},

	login: async (username, password) => {
		const data = await post('/user/login', { username, password });
		setToken(data.token);
		return data;
	},

	logout: async () => {
		const data = await post('/user/logout');
		deleteAllCookies();
		return data;
	},

	isTokenValid: () => post('/user/is_token_valid', { token: getToken() }),

	getProfile: (username) => get(`/user/profile/${username}`),
	updateUser: (username, bio) => post('/user/update_user', { username, bio }),
	deleteUser: () => post('/user/delete_user'),
	createGuest: async () => {
		const data = await post('/user/create_guest');
		setToken(data.token);
		return data;
	},
	getProfile: (username) => get(`/user/profile/${username}`, getToken()),
	getStats: (username) => get(`/user/stats/${username}`, getToken()),
	listUsers: () => get('/user/list', getToken()),
	sendFriendRequest: (username) => post('/user/send_friend_request', { username }, getToken()),
	removeFriendRequest: (username) => post('/user/remove_friend_request', { username }, getToken()),
	getFriendship: (username) => post(`/user/get_friendship`, { username }, getToken()),
	getFriends: (username) => post(`/user/get_friends`, { username }, getToken()),
};

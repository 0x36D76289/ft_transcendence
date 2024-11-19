import { get, post } from './api.js';
import { getToken, setToken, setUsername, setBio } from '../utils/cookies.js';

export const UserAPI = {
	register: async (username, password, bio = '') => {
		const data = await post('/user/register', { username, password, bio });
		return data;
	},

	login: async (username, password) => {
		const data = await post('/user/login', { username, password });
		setToken(data.token);
		setUsername(data.username);
		return data;
	},

	logout: async () => {
		const data = await post('/user/logout');
		deleteToken();
		deleteUsername();
		deleteBio();
		return data;
	},

	isTokenValid: () => post('/user/is_token_valid', { token: getToken() }),

	updateUser: (username, bio) => {
		const data = post('/user/update_user', { username, bio }, getToken());
		setUsername(data.username);
		setBio(data.bio);
		return data;
	},

	deleteUser: () => {
		const data = post('/user/delete_user', {}, getToken());
		deleteToken();
		deleteUsername();
		deleteBio();
		return data;
	},

	createGuest: async () => {
		const data = await post('/user/create_guest');
		setToken(data.token);
		setUsername(data.username);
		return data;
	},

	getProfile: (username) => get(`/user/profile/${username}`, getToken()),
	getStats: (username) => get(`/user/stats/${username}`, getToken()),
	listUsers: () => get('/user/list', getToken()),
	sendFriendRequest: (username) => post('/user/send_friend_request', { username }, getToken()),
	removeFriendRequest: (username) => post('/user/remove_friend_request', { username }, getToken()),
	getFriendship: (username) => post('/user/get_friendship', { username }, getToken()),
	getFriends: () => get('/user/get_friends', getToken()),
};

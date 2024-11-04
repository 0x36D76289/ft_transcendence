import { get, post } from './api.js';

export const ChatAPI = {
	getConversation: (token, convoId) => get(`/chat/${convoId}`, token),
	getConversations: (token) => get('/chat', token),
	startConversation: (token, username) => post('/chat/start', { username }, token),
	blockUser: (token, username) => post('/chat/block', { username }, token),
	unblockUser: (token, username) => post('/chat/unblock', { username }, token),
	isUserBlocked: (token, username) => get(`/chat/is_user_blocked`, token),
};

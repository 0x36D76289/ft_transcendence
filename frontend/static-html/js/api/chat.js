import { get, post } from './api.js';
import { getToken } from '../utils/cookies.js';

export const ChatAPI = {
	getConversation: (convoId) => get(`/chat/${convoId}`, getToken()),
	getConversations: () => get('/chat/conversations', getToken()),
	startConversation: (username) => post('/chat/start', { username }, getToken()),
	blockUser: (username) => post('/chat/block', { username }, getToken()),
	unblockUser: (username) => post('/chat/unblock', { username }, getToken()),
	isUserBlocked: (username) => get(`/chat/is_user_blocked`, { username }, getToken()),
};

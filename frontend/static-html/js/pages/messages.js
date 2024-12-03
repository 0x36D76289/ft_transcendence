import { UserAPI } from '../api/user.js';
import { ChatAPI } from '../api/chat.js';
import { i18n } from '../services/i18n.js';
import { getUsername } from '../utils/cookies.js';

export function render() {
	return `
<div class="messages-container">
	<div class="friends-sidebar">
		<div class="friends-header">
			<h2>${i18n.t('messages.friends')}</h2>
			<div class="search-container">
				<input type="text" id="friend-search" placeholder="${i18n.t('messages.search')}">
			</div>
		</div>
		<div class="friends-list" id="friends-list">
			<!-- Friends will be populated here -->
		</div>
	</div>
	<div class="chat-container">
		<div class="welcome-message" id="welcome-message">
			<h1>${i18n.t('messages.welcome')}</h1>
			<p>${i18n.t('messages.select_friend')}</p>
		</div>
		<div class="active-chat hidden" id="active-chat">
			<div class="chat-header" id="chat-header">
				<!-- Active chat header -->
			</div>
			<div class="messages-list" id="messages-list">
				<!-- Messages will be populated here -->
			</div>
			<div class="message-input">
				<textarea id="message-text" placeholder="${i18n.t('messages.type_message')}"></textarea>
				<button class="send-button" id="send-button">
					${i18n.t('messages.send')}
				</button>
			</div>
		</div>
	</div>
</div>
	`;
}

export function init() {
	let activeSocket = null;
	let currentConversation = null;

	let conversation = ChatAPI.getConversations();

	const messagesList = document.getElementById('messages-list');
	const messageInput = document.getElementById('message-text');
	const sendButton = document.getElementById('send-button');
	const searchInput = document.getElementById('friend-search');

	async function loadFriends() {
		try {
			const friends = await UserAPI.getFriends(getUsername());
			document.getElementById('friends-list').innerHTML = friends.map(friend => `
				<div class="friend-item" data-username="${friend.user.username}">
					<div class="friend-avatar">
						<img src="/media${friend.user.pfp}" alt="${friend.user.username}'s avatar">
						<div class="status-indicator ${friend.user.is_online ? 'online' : 'offline'}"></div>
					</div>
					<div class="friend-info">
						<span class="friend-name">${friend.user.username}</span>
						<span class="friend-status">${friend.user.is_online ? i18n.t('friends.online') : i18n.t('friends.offline')}</span>
					</div>
				</div>
			`).join('');

			// Add click listeners to friend items
			document.querySelectorAll('.friend-item').forEach(item => {
				item.addEventListener('click', () => {
					startChat(item.dataset.username);
				});
			});
		} catch (error) {
			console.error('Failed to load friends:', error);
		}
	}

	async function startChat(username) {
		try {
			const conversation = await ChatAPI.startConversation(username);
			currentConversation = conversation;

			// Show active chat
			document.getElementById('welcome-message').classList.add('hidden');
			document.getElementById('active-chat').classList.remove('hidden');

			// Update chat header
			document.getElementById('chat-header').innerHTML = `
				<div class="chat-header-info">
					<h3>${username}</h3>
				</div>
			`;

			// Load previous messages
			messagesList.innerHTML = conversation.message_set.map(msg => `
				<div class="message ${msg.sender === username ? 'received' : 'sent'}">
					<div class="message-content">${msg.message}</div>
					<div class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
				</div>
			`).join('');

			// Scroll to bottom
			messagesList.scrollTop = messagesList.scrollHeight;
		} catch (error) {
			console.error('Failed to start chat:', error);
		}
	}

	function appendMessage(message) {
		const messageElement = document.createElement('div');
		messageElement.classList.add('message', message.sender === currentConversation.receiver ? 'received' : 'sent');
		messageElement.innerHTML = `
			<div class="message-content">${message.message}</div>
			<div class="message-time">${new Date().toLocaleTimeString()}</div>
		`;
		messagesList.appendChild(messageElement);
		messagesList.scrollTop = messagesList.scrollHeight;
	}

	// Event listeners
	sendButton.addEventListener('click', () => {
		const message = messageInput.value.trim();
		if (message && activeSocket) {
			activeSocket.send(JSON.stringify({ message }));
			messageInput.value = '';
		}
	});

	messageInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendButton.click();
		}
	});

	searchInput.addEventListener('input', (e) => {
		const searchTerm = e.target.value.toLowerCase();
		document.querySelectorAll('.friend-item').forEach(item => {
			const friendName = item.querySelector('.friend-name').textContent.toLowerCase();
			item.style.display = friendName.includes(searchTerm) ? 'flex' : 'none';
		});
	});

	// Initial load
	loadFriends();
}
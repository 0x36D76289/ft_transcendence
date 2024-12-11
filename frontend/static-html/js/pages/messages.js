import { ChatAPI } from '../api/chat.js';
import { i18n } from '../services/i18n.js';
import { getToken, getUsername } from '../utils/cookies.js';
import { WS_URL } from '../app.js';

let socket = null;

export function render() {
	return `
	<div class="messages-container">
		<div class="conversations-list" id="conversations-list">
		</div>
		<div class="chat-window" id="chat-window">
			<div class="chat-header">
				<div id="chat-participants">
				</div>
			</div>
			<div class="messages-list" id="messages-list">
			</div>
			<div class="message-input-container">
				<textarea id="message-input" placeholder="${i18n.t('messages.type_message')}" rows="3"></textarea>
				<button id="send-message-btn" class="btn-accent">
					${i18n.t('messages.send')}
				</button>
			</div>
		</div>
	</div>
	`;
}

export async function init() {
	const conversationsList = document.getElementById('conversations-list');
	const chatParticipants = document.getElementById('chat-participants');
	const messagesList = document.getElementById('messages-list');
	const messageInput = document.getElementById('message-input');
	const sendMessageBtn = document.getElementById('send-message-btn');

	let currentConversationId = null;

	async function loadConversations() {
		try {
			const conversations = await ChatAPI.getConversations();
			conversationsList.innerHTML = conversations.map(conv => {
				const otherUser = conv.participants[0];
				return `
					<div class="conversation-item" data-conv-id="${conv.id}">
						<img src="/media/${otherUser.pfp}" alt="${otherUser.username}" class="avatar">
						<div class="conversation-details">
							<h4>${otherUser.username}</h4>
							<p class="last-message">${conv.last_message?.content || ''}</p>
						</div>
					</div>
				`;
			}).join('');

			document.querySelectorAll('.conversation-item').forEach(item => {
				item.addEventListener('click', () => {
					document.querySelectorAll('.conversation-item').forEach(el => {
						el.classList.remove('active');
					});

					item.classList.add('active');

					currentConversationId = item.dataset.convId;
					loadConversation(currentConversationId);
					setupWebSocket(currentConversationId);
				});
			});
		} catch (error) {
			console.error('Failed to load conversations:', error);
		}
	}

	async function loadConversation(conversationId) {
		try {
			const conversation = await ChatAPI.getConversation(conversationId);

			const otherUser = conversation.participants.find(p => p.username !== getUsername());

			chatParticipants.innerHTML = conversation.participants.map(participant => `
				<img src="/media/${participant.pfp}" alt="${participant.username}" class="avatar">
			`).join('');

			messagesList.innerHTML = conversation.message_set.reverse().map(message => `
				<div class="message ${message.sender === getUsername() ? 'sent' : 'received'}">
					<div class="message-content">
						${message.content}
					</div>
				</div>
			`).join('');

			messagesList.scrollTop = messagesList.scrollHeight;
		} catch (error) {
			console.error('Failed to load conversation:', error);
		}
	}

	async function sendMessage() {
		// TODO: Add message logic
	}

	function setupWebSocket(conversationId) {
		if (socket) {
			socket.close();
		}

		socket = new WebSocket(`${WS_URL}/chat/${conversationId}/?token=${getToken()}`);

		socket.onmessage = function (event) {
			const data = JSON.parse(event.data);
			if (data.message) {
				const messageElement = document.createElement('div');
				messageElement.className = `message ${data.sender === getUsername() ? 'sent' : 'received'}`;
				messageElement.innerHTML = `
					<div class="message-content">
						${data.message}
					</div>
				`;
				messagesList.appendChild(messageElement);
				messagesList.scrollTop = messagesList.scrollHeight;
			}
		};

		socket.onclose = function (event) {
			console.log('WebSocket closed:', event);
		};

		socket.onerror = function (error) {
			console.error('WebSocket error:', error);
		};
	}

	sendMessageBtn.addEventListener('click', sendMessage);
	messageInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	});

	await loadConversations();
}

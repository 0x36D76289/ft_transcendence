import { ChatAPI } from '../api/chat.js';
import { i18n } from '../services/i18n.js';
import { getToken, getUsername } from '../utils/cookies.js';
import { WS_URL } from '../app.js';
import { send_to_online_sock } from '../api/socket.js';

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
					<i class="material-icons">send</i>
				</button>
				<button id="invite-match-btn" class="btn-accent">
					${i18n.t('messages.invite_to_match')}
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
	const inviteMatchBtn = document.getElementById('invite-match-btn');

	let currentConversationId = null;

	async function loadConversations() {
		try {
			const conversations = await ChatAPI.getConversations();
			conversationsList.innerHTML = conversations.map(conv => {
				const otherUser = conv.participants[0];

				if (otherUser === undefined) {
					return '';
				}
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
	
			// Dynamic Chat Header
			chatParticipants.innerHTML = conversation.participants.map(participant => `
				<div class="chat-participant">
					<span><img src="/media/${participant.pfp}" alt="${participant.username}" class="avatar" onclick="showProfilePreview('${participant.username}')"></span>
				</div>
			`).join('');
	
			// Messages with Profile Pictures
			messagesList.innerHTML = conversation.message_set.reverse().map(message => {
				const sender = conversation.participants.find(p => p.username === message.sender);
				const senderPfp = sender ? sender.pfp : 'default_pfp.svg';
	
				return `
					<div class="messages ${message.sender === getUsername() ? 'sent' : 'received'}">
							<img src="/media/${senderPfp}" alt="${message.sender}" class="message-avatar" onclick="showProfilePreview('${message.sender}')">
							<div class="message-content-wrapper">
									<div class="message-content">
										${message.content}
									</div>
									<div class="message-time">
										${new Date(message.time_created).toLocaleTimeString()}
									</div>
							</div>
					</div>
					`;
			}).join('');
	
			messagesList.scrollTop = messagesList.scrollHeight;
		} catch (error) {
			console.error('Failed to load conversation:', error);
		}
	}
	
	async function sendMessage() {
		const messageInput = document.getElementById('message-input');

		if (!messageInput.value) {
			return;
		}

		console.log(messageInput.value);
		socket.send(JSON.stringify({
			message: messageInput.value
		}));
		messageInput.value = '';
	}

	function setupWebSocket(conversationId) {
		if (socket) {
			socket.close();
		}

		socket = new WebSocket(`${WS_URL}/chat/${conversationId}?token=${getToken()}`);

		socket.onmessage = async (event) => {
			const message = JSON.parse(event.data);
			console.log(message.content);

			// Fetch conversation details to get sender's profile picture
			const conversation = await ChatAPI.getConversation(conversationId);
			const sender = conversation.participants.find(p => p.username === message.sender);
			const senderPfp = sender ? sender.pfp : 'default_pfp.svg';

			messagesList.innerHTML += `
				<div class="messages ${message.sender === getUsername() ? 'sent' : 'received'}">
						<img src="/media/${senderPfp}" alt="${message.sender}" class="message-avatar">
						<div class="message-content-wrapper">
								<div class="message-content">
										${message.content}
								</div>
								<div class="message-time">
										${new Date(message.time_created).toLocaleTimeString()}
								</div>
						</div>
				</div>
			`;
			messagesList.scrollTop = messagesList.scrollHeight;
		};
	}

	async function inviteToMatch() {
		if (currentConversationId) {
			const conversation = await ChatAPI.getConversation(currentConversationId);
			const otherUser = conversation.participants.find(p => p.username !== getUsername());
			if (otherUser) {
				send_to_online_sock("fight " + otherUser.username);
				console.log(`Invited ${otherUser.username} to a match`);
			}
		}
	}

	sendMessageBtn.addEventListener('click', sendMessage);
	messageInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	});

	inviteMatchBtn.addEventListener('click', inviteToMatch);

	await loadConversations();
}

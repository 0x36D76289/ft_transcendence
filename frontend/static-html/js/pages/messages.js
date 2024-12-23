import { ChatAPI } from '../api/chat.js';
import { i18n } from '../services/i18n.js';
import { getToken, getUsername } from '../utils/cookies.js';
import { WS_URL } from '../app.js';
import { send_to_online_sock } from '../api/socket.js';
import { showProfilePreview } from '../components/profilepopup.js';

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
			conversationsList.innerHTML = '';

			conversations.forEach(conv => {
				const otherUser = conv.participants[0];
				if (!otherUser) return;

				const conversationItem = document.createElement('div');
				conversationItem.classList.add('conversation-item');
				conversationItem.dataset.convId = conv.id;

				const avatarButton = document.createElement('button');
				avatarButton.classList.add('avatar-button');
				avatarButton.dataset.username = otherUser.username;

				const avatarImg = document.createElement('img');
				avatarImg.src = `/media/${otherUser.pfp}`;
				avatarImg.alt = otherUser.username;
				avatarImg.classList.add('avatar');
				avatarButton.appendChild(avatarImg);

				const conversationDetails = document.createElement('div');
				conversationDetails.classList.add('conversation-details');

				const usernameHeading = document.createElement('h4');
				usernameHeading.textContent = otherUser.username;
				conversationDetails.appendChild(usernameHeading);

				const lastMessageElement = document.createElement('p');
				lastMessageElement.classList.add('last-message');
				lastMessageElement.textContent = conv.last_message?.content || '';
				conversationDetails.appendChild(lastMessageElement);

				conversationItem.appendChild(avatarButton);
				conversationItem.appendChild(conversationDetails);

				conversationsList.appendChild(conversationItem);
			});

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

			document.querySelectorAll('.avatar-button').forEach(button => {
				button.addEventListener('click', (e) => {
					e.stopPropagation();
					showProfilePreview(button.dataset.username);
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
			chatParticipants.innerHTML = ''; // Clear existing participants
			conversation.participants.forEach(participant => {
				const chatParticipant = document.createElement('div');
				chatParticipant.classList.add('chat-participant');

				const avatarButton = document.createElement('button');
				avatarButton.classList.add('avatar-button');
				avatarButton.dataset.username = participant.username;

				const avatarImg = document.createElement('img');
				avatarImg.src = `/media/${participant.pfp}`;
				avatarImg.alt = participant.username;
				avatarImg.classList.add('avatar');

				avatarButton.appendChild(avatarImg);
				chatParticipant.appendChild(avatarButton);
				chatParticipants.appendChild(chatParticipant);
			});

			chatParticipants.querySelectorAll('.avatar-button').forEach(button => {
				button.addEventListener('click', () => {
					showProfilePreview(button.dataset.username);
				});
			});

			// Messages with Profile Pictures
			messagesList.innerHTML = '';
			conversation.message_set.reverse().forEach(message => {
				const sender = conversation.participants.find(p => p.username === message.sender);
				const senderPfp = sender ? sender.pfp : 'default_pfp.svg';

				const messageElement = document.createElement('div');
				messageElement.classList.add('messages');
				messageElement.classList.add(message.sender === getUsername() ? 'sent' : 'received');

				const avatarImg = document.createElement('img');
				avatarImg.src = `/media/${senderPfp}`;
				avatarImg.alt = message.sender;
				avatarImg.classList.add('message-avatar');

				const messageContentWrapper = document.createElement('div');
				messageContentWrapper.classList.add('message-content-wrapper');

				const messageContent = document.createElement('div');
				messageContent.classList.add('message-content');
				messageContent.textContent = message.content;

				const messageTime = document.createElement('div');
				messageTime.classList.add('message-time');
				messageTime.textContent = new Date(message.time_created).toLocaleTimeString();

				messageContentWrapper.appendChild(messageContent);
				messageContentWrapper.appendChild(messageTime);

				messageElement.appendChild(avatarImg);
				messageElement.appendChild(messageContentWrapper);

				messagesList.appendChild(messageElement);
			});
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
		socket.send(JSON.stringify({ message: messageInput.value }));
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

			const messageElement = document.createElement('div');
			messageElement.classList.add('messages');
			messageElement.classList.add(message.sender === getUsername() ? 'sent' : 'received');

			const avatarImg = document.createElement('img');
			avatarImg.src = `/media/${senderPfp}`;
			avatarImg.alt = message.sender;
			avatarImg.classList.add('message-avatar');

			const messageContentWrapper = document.createElement('div');
			messageContentWrapper.classList.add('message-content-wrapper');

			const messageContent = document.createElement('div');
			messageContent.classList.add('message-content');
			messageContent.textContent = message.content;

			const messageTime = document.createElement('div');
			messageTime.classList.add('message-time');
			messageTime.textContent = new Date(message.time_created).toLocaleTimeString();

			messageContentWrapper.appendChild(messageContent);
			messageContentWrapper.appendChild(messageTime);

			messageElement.appendChild(avatarImg);
			messageElement.appendChild(messageContentWrapper);

			messagesList.appendChild(messageElement);
			messagesList.scrollTop = messagesList.scrollHeight;
		};
	}

	async function inviteToMatch() {
		if (currentConversationId) {
			const conversation = await ChatAPI.getConversation(currentConversationId);
			const otherUser = conversation.participants.find(p => p.username !== getUsername());
			if (otherUser) {
				send_to_online_sock("fight " + otherUser.username);
				console.log(`${getUsername()} ${i18n.t('messages.invite_to_match_message')}`);
				socket.send(JSON.stringify({
					message: `${getUsername()} ${i18n.t('messages.invite_to_match_message')}`
				}));
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
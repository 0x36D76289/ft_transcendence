class Messaging {
	constructor() {
		this.messageContainer = document.getElementById('messageContainer');
		this.messageList = document.getElementById('messageList');
		this.messageForm = document.getElementById('messageForm');
		this.messageInput = document.getElementById('messageInput');

		this.ws = new WebSocket('ws://' + window.location.host + '/chat');
		this.ws.onmessage = this.handleMessage.bind(this);

		this.messageForm.addEventListener('submit', this.sendMessage.bind(this));
	}

	sendMessage(event) {
		event.preventDefault();
		const message = this.messageInput.value.trim();
		if (message) {
			this.ws.send(JSON.stringify({
				type: 'chatMessage',
				content: message
			}));
			this.messageInput.value = '';
		}
	}

	handleMessage(event) {
		const data = JSON.parse(event.data);
		if (data.type === 'chatMessage') {
			this.displayMessage(data.sender, data.content);
		}
	}

	displayMessage(sender, content) {
		const messageElement = document.createElement('p');
		messageElement.textContent = `${sender}: ${content}`;
		this.messageList.appendChild(messageElement);
		this.messageList.scrollTop = this.messageList.scrollHeight;
	}

	show() {
		this.messageContainer.classList.remove('hidden');
	}

	hide() {
		this.messageContainer.classList.add('hidden');
	}
}

const messaging = new Messaging();
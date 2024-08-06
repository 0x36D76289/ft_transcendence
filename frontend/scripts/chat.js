export class Chat {
	constructor() {
		this.chatInput = document.getElementById('chatInput');
		this.chatOutput = document.getElementById('chatOutput');
	}

	addChatMessage(message) {
		const messageElement = document.createElement('p');
		const timestamp = new Date().toLocaleTimeString();

		messageElement.innerHTML = `<span class="timestamp">${timestamp}</span> ${message}`;
		this.chatOutput.appendChild(messageElement);
		this.chatOutput.scrollTop = this.chatOutput.scrollHeight;
	}

	initializeChat() {
		this.chatInput.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				const message = this.chatInput.value;

				if (message.trim() !== '') {
					if (this.game && typeof this.game.addChatMessage === 'function') {
						this.game.addChatMessage(`You: ${message}`);
					}
					this.chatInput.value = '';
				}
			}
		});
	}
}

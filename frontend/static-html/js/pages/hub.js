import { postData } from '../api/utils.js';
import { loadPage, navigate } from '../spa.js';
import { readCookie } from '../cookie.js';
// import { generateMultipleProfiles } from '../profile_generator.js';

const HTML = `
<div class="hub-container">
  <div class="left-sidebar">
    <div class="user-avatar"></div>
    <div class="user-info">
      <p class="username">username</p>
      <p class="last-login">Last login: 05/12/2024</p>
      <p class="creation-date">Created: 04/12/2001</p>
      <p class="bio">User bio goes here...</p>
    </div>
    <div class="sidebar-controls">
      <button class="settings-button"><i class="fa fa-cog"></i></button>
      <div class="status-toggle"><i class="fa fa-microphone"></i></div>
    </div>
  </div>
  
  <div class="central-hub">
    <div class="user-grid-container">
      <div class="user-grid" id="userGrid"></div>
    </div>
  </div>
  
  <div class="right-sidebar">
    <div class="game-controls">
      <button class="play-button">Play</button>
      <button class="tournaments-button">Tournaments</button>
    </div>
    <div class="global-chat">
      <h3>Global Chat</h3>
      <div class="chat-messages" id="chatMessages"></div>
      <input type="text" id="chatInput" placeholder="Type your message...">
    </div>
  </div>
</div>
`

const CSS = `
.hub-container {
  display: flex;
  height: 100vh;
  color: var(--text-color);
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: var(--line-height);
  background-color: var(--background-color);
}

.left-sidebar, .right-sidebar {
  width: var(--sidebar-width);
  background-color: rgba(47, 47, 47, 0.8);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.left-sidebar {
  left: 0;
}

.right-sidebar {
  right: 0;
}

.left-sidebar:hover, .right-sidebar:hover {
  background-color: rgba(47, 47, 47, 1);
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #4caf50;
  margin: 0 auto 20px;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.user-info p {
  margin: 5px 0;
  font-family: "JetBrains Mono", monospace;
}

.sidebar-controls {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.central-hub {
  flex-grow: 1;
  padding: 20px;
  background-color: var(--background-color);
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-grid-container {
  width: 100%;
  max-width: 1200px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--user-cell-min-width), 1fr));
  gap: 20px;
  justify-content: center;
}

.user-cell {
  background-color: rgba(63, 63, 63, 0.8);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  max-width: var(--user-cell-max-width);
  margin: 0 auto;
}

.user-cell:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.user-cell img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.user-cell:hover img {
  transform: scale(1.1);
}

.user-cell .status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.online { background-color: #4caf50; }
.offline { background-color: #bdbdbd; }

.game-controls {
  margin-bottom: 20px;
}

.play-button, .tournaments-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 20px;
  color: var(--text-color);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family);
}

.play-button {
  background-color: var(--button-bg-color);
}

.tournaments-button {
  background-color: var(--button-bg-color);
}

.play-button:hover, .tournaments-button:hover {
  background-color: var(--button-hover-bg-color);
  transform: translateY(-2px);
}

.play-button:active, .tournaments-button:active {
  background-color: var(--button-active-bg-color);
  transform: translateY(0);
}

.global-chat {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex-grow: 1;
  background-color: rgba(63, 63, 63, 0.8);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
  font-family: "JetBrains Mono", monospace;
}

#chatInput {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: rgba(63, 63, 63, 0.8);
  color: var(--text-color);
  font-family: "JetBrains Mono", monospace;
  transition: all 0.3s ease;
}

#chatInput:focus {
  background-color: rgba(63, 63, 63, 1);
  outline: none;
  box-shadow: 0 0 0 2px var(--button-hover-bg-color);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.user-cell, .chat-messages > div {
  animation: fadeIn 0.5s ease-out;
}`

export function hub() {
  loadPage(HTML, CSS);

  const userGrid = document.getElementById('userGrid');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');

  function getRandomProfilePicture() {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://randomuser.me/api/portraits/lego/${randomId % 10}.jpg`;
  }

  function getRandomUsername() {
    const adjectives = ['Cool', 'Super', 'Fast', 'Smart', 'Brave', 'Happy', 'Sad', 'Angry', 'Funny', 'Lazy'];
    const nouns = ['Lion', 'Tiger', 'Bear', 'Shark', 'Eagle', 'Wolf', 'Fox', 'Panda', 'Dragon', 'Unicorn'];
    return adjectives[Math.floor(Math.random() * adjectives.length)] + nouns[Math.floor(Math.random() * nouns.length)];
  }

  async function loadUsers() {
    try {
      const users = Array.from({ length: 50 }, () => ({
        avatar: getRandomProfilePicture(),
        username: getRandomUsername(),
        online: Math.random() > 0.5
      }));
      userGrid.innerHTML = users.map(user => `
        <div class="user-cell">
          <img src="${user.avatar}" alt="${user.username}">
          <p>${user.username}</p>
          <div class="status-indicator ${user.online ? 'online' : 'offline'}"></div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  function setupChat() {
    chatInput.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter' && chatInput.value.trim()) {
        try {
          await postData('/chat/message', {}, { message: chatInput.value.trim() }, readCookie('authToken'));
          chatInput.value = '';
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
    });

    // Here you would typically set up a WebSocket connection for real-time chat
    // For simplicity, we'll just simulate incoming messages
    setInterval(() => {
      const fakeMessage = {
        username: 'User ' + Math.floor(Math.random() * 10),
        message: 'Hello, this is a simulated message!',
        timestamp: new Date().toLocaleTimeString()
      };
      appendMessage(fakeMessage);
    }, 5000);
  }

  function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${message.username}</strong> (${message.timestamp}): ${message.message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  document.querySelector('.play-button').addEventListener('click', () => navigate('/game'));
  document.querySelector('.tournaments-button').addEventListener('click', () => navigate('/tournaments'));

  loadUsers();
  setupChat();
}
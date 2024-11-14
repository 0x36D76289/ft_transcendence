import { ChatAPI } from '../api/chat.js';
import { getUsername } from '../utils/cookies.js';

export function render() {
  return `
    <div class="friends-container">
      <header class="friends-header">
        <h1>Messages</h1>
        <p class="header-subtitle">Vos conversations récentes</p>
      </header>

      <div class="conversations-list" id="conversations-list">
        <div class="loading-spinner">Chargement...</div>
      </div>
    </div>
  `;
}

function createConversationElement(conversation) {
  
}

async function loadConversations() {

}

export async function init() {
  await loadConversations();

  setInterval(loadConversations, 30000);
}
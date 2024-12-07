import { i18n } from '../services/i18n.js';

let participants = [];

export function render() {
  return `
    <div class="tournament-container">
      <section class="current-tournament">
        <h2>${i18n.t('tournaments.current_tournament')}</h2>
        <div class="participant-list">
          ${participants.map(participant => `
            <div class="participant ${getParticipantClass(participant)}">
              ${participant.name} 
              ${participant.accepted ? '✅' :
      (participant.accepted === false ? '❌' : '⏳')}
            </div>
          `).join('')}
        </div>
      </section>

      <section class="add-participant">
        <div class="input-group">
          <input type="text" id="username" placeholder="${i18n.t('tournaments.enter_username')}">
          <button class="add-button" onclick="addParticipant('username')">+</button>
        </div>
        <div class="input-group">
          <input type="text" id="bot-name" placeholder="${i18n.t('tournaments.enter_bot_name')}">
          <button class="add-button" onclick="addParticipant('bot-name')">+</button>
        </div>
      </section>

      <section class="start-tournament">
        <button class="start-button">${i18n.t('tournaments.start_tournament')}</button>
      </section>
    </div>
  `;
}

function getParticipantClass(participant) {
  if (participant.accepted === true) return 'participant-accepted';
  if (participant.accepted === false) return 'participant-rejected';
  return 'participant-pending';
}

export function init() {
  function addParticipant(inputId) {
    const input = document.getElementById(inputId);
    if (input && input.value) {
      participants.push({
        name: input.value,
        accepted: null // Initially in pending state
      });
      input.value = '';
      updateParticipantList();
    }
  }

  function updateParticipantList() {
    const participantList = document.querySelector('.participant-list');
    if (participantList) {
      participantList.innerHTML = participants.map(participant => `
        <div class="participant ${getParticipantClass(participant)}">
          ${participant.name} 
          ${participant.accepted ? '✅' :
          (participant.accepted === false ? '❌' : '⏳')}
        </div>
      `).join('');
    }
  }

  participants.push({ name: 'Player1', accepted: null });
  participants.push({ name: 'Bot1', accepted: true });
  participants.push({ name: 'Player2', accepted: false });
  participants.push({ name: 'Bot2', accepted: null });
  participants.push({ name: 'Bot3', accepted: true });
  participants.push({ name: 'Player3', accepted: false });
  participants.push({ name: 'Bot4', accepted: null });
  participants.push({ name: 'Bot5', accepted: true });
  participants.push({ name: 'Player4', accepted: false });


  updateParticipantList();
}
import { i18n } from '../services/i18n.js';

export function render() {
  return `
	  <div class="tournament-container">
      <section class="current-tournament">
        <h2>${i18n.t('tournaments.current_tournament')}</h2>
        <div class="participant-list">
          <div class="participant">user 1</div>
          <div class="participant">user 2</div>
          <div class="participant">Bot 1</div>
        </div>
      </section>

      <section class="add-participant">
        <div class="input-group">
          <input type="text" id="username" placeholder="${i18n.t('tournaments.enter_username')}">
          <button class="add-button">+</button>
        </div>
        <div class="input-group">
          <input type="text" id="bot-name" placeholder="${i18n.t('tournaments.enter_bot_name')}">
          <button class="add-button">+</button>
        </div>
      </section>

      <section class="start-tournament">
        <button class="start-button">${i18n.t('tournaments.start_tournament')}</button>
      </section>
    </div>
  `;
}

export function init() {
  console.log('Tournament page initialized');
}

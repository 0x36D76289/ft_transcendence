import { UserAPI } from '../api/user.js';
import { GameAPI } from '../api/game.js';
import { i18n } from '../services/i18n.js';
import { getUsername } from '../utils/cookies.js';
import { popupSystem } from '../services/popup.js';
import { navigate } from '../app.js';

export function render() {
	return `
<div class="profile-container">
    <header class="profile-header">
        <h1>${i18n.t('user.title')}</h1>
    </header>
    
    <div class="profile-content">
        <div class="profile-section">
            <div class="profile-info-card">
                <div class="profile-avatar">
                    <img src="/media/pfp/default_pfp.svg" class="avatar-placeholder" id="profile-image"></img>
                    <input type="file" id="pfp-input" class="hidden" accept="image/*"/>
                </div>
                
                <div class="profile-details">
                    <div class="info-group">
                        <label>${i18n.t('user.username')}</label>
                        <input type="text" id="username-input"/>
                    </div>
                    
                    <div class="info-group">
                        <label>${i18n.t('user.bio')}</label>
                        <textarea id="bio-input" rows="3"></textarea>
                    </div>
                    
                    <div class="info-group">
                        <label>${i18n.t('user.joined')}</label>
                        <span id="date-joined"></span>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button id="save-profile" class="save-button">
                        ${i18n.t('user.save')}
                    </button>
                </div>
            </div>

            <div class="profile-stats-card">
                <h3>${i18n.t('user.stats')}</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value" id="games-played">0</span>
                        <span class="stat-label">${i18n.t('user.games_played')}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="win-rate">0%</span>
                        <span class="stat-label">${i18n.t('user.win_rate')}</span>
                    </div>
                </div>
            </div>

            <div class="game-history-card">
                <h3 class="game-history-header">${i18n.t('user.game_history')}</h3>
                <div id="game-history-list" class="game-history-list">
                    <!-- Game history will be populated here -->
                </div>
            </div>
        </div>

        <div class="account-actions-card">
            <h3>${i18n.t('user.account_actions')}</h3>
            <div class="account-actions">
                <button id="logout-button" class="action-button logout-button">
                    <span class="material-icons">logout</span>
                    ${i18n.t('user.logout')}
                </button>
                
                <button id="delete-account-button" class="action-button delete-button">
                    <span class="material-icons">delete_forever</span>
                    ${i18n.t('user.delete_account')}
                </button>
            </div>

            <div id="delete-confirmation" class="delete-confirmation hidden">
                <p>${i18n.t('user.delete_confirmation')}</p>
                <div class="confirmation-actions">
                    <button id="confirm-delete" class="delete-button">
                        ${i18n.t('user.confirm_delete')}
                    </button>
                    <button id="cancel-delete" class="cancel-button">
                        ${i18n.t('user.cancel')}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
`;
}

export async function init() {
	const username = getUsername();

	try {
		const userData = await UserAPI.getProfile(username);
		const userStat = await UserAPI.getUserStats(username);
		const gameHistory = await GameAPI.getUserGameHistory(username);

		// Set data
		document.getElementById('profile-image').src = `/media/${userData.pfp}`;
		document.getElementById('username-input').value = userData.username;
		document.getElementById('bio-input').value = userData.bio;
		document.getElementById('date-joined').textContent = new Date(userData.date_joined).toLocaleDateString();

		// Set stats
		document.getElementById('games-played').textContent = userStat.games_played;
		document.getElementById('win-rate').textContent = userStat.win_rate.toFixed(2) + '%';

		// Populate game history
		const gameHistoryList = document.getElementById('game-history-list');
		gameHistoryList.innerHTML = '';

		if (gameHistory.length === 0) {
			const noGamesMessage = document.createElement('p');
			noGamesMessage.textContent = i18n.t('user.no_games');
			gameHistoryList.appendChild(noGamesMessage);
		} else {
			gameHistory.forEach(game => {
				const gameItem = document.createElement('div');
				gameItem.classList.add('game-history-item');

				const gamePlayers = document.createElement('div');
				gamePlayers.classList.add('game-players');

				const player1 = document.createElement('span');
				player1.textContent = game.p1.username;

				const vs = document.createElement('span');
				vs.classList.add('vs');
				vs.textContent = 'vs';

				const player2 = document.createElement('span');
				player2.textContent = game.p2.username;

				if (game.p1_score > game.p2_score) {
					player1.classList.add('player-self');
				} else {
					player2.classList.add('player-self');
				}

				gamePlayers.appendChild(player1);
				gamePlayers.appendChild(vs);
				gamePlayers.appendChild(player2);

				const gameScore = document.createElement('div');
				gameScore.classList.add('game-score');
				gameScore.textContent = `${game.p1_score} - ${game.p2_score}`;

				const gameDate = document.createElement('div');
				gameDate.classList.add('game-date');
				gameDate.textContent = new Date(game.time_start).toLocaleDateString();

				gameItem.appendChild(gamePlayers);
				gameItem.appendChild(gameScore);
				gameItem.appendChild(gameDate);

				gameHistoryList.appendChild(gameItem);
			});
		}

		// Save profile button
		document.getElementById('save-profile').addEventListener('click', async () => {
			const newUsername = document.getElementById('username-input').value;
			const newBio = document.getElementById('bio-input').value;
			const newPfp = document.getElementById('pfp-input').files[0];

			const formData = new FormData();
			if (newUsername !== userData.username) {
				formData.append('username', newUsername);
			}
			if (newBio !== userData.bio) {
				formData.append('bio', newBio);
			}
			if (newPfp != undefined) {
				formData.append('pfp', newPfp)
			}

			console.log(formData);

			const updatedData = await UserAPI.updateProfile(formData);

			if (updatedData) {
				document.getElementById('username-input').value = updatedData.username;
				document.getElementById('bio-input').value = updatedData.bio;
				popupSystem('success', i18n.t('notifications.profile.update'));
			}
		});

		// Logout button
		document.getElementById('logout-button').addEventListener('click', async () => {
			await UserAPI.logout();

			document.getElementById('sidebar').remove();
			document.getElementById('content').style.marginLeft = '0';
			navigate('/');
		});

		// Delete account button
		document.getElementById('delete-account-button').addEventListener('click', () => {
			document.getElementById('delete-confirmation').classList.remove('hidden');
		});

		// Confirm delete button
		document.getElementById('confirm-delete').addEventListener('click', async () => {
			await UserAPI.deleteAccount();

			// delete sidebar
			document.getElementById('sidebar').remove();
			document.getElementById('content').style.marginLeft = '0';

			navigate('/');
		});

		// Cancel delete button
		document.getElementById('cancel-delete').addEventListener('click', () => {
			document.getElementById('delete-confirmation').classList.add('hidden');
		});

		// Edit avatar button
		document.getElementById('profile-image').addEventListener('click', () => {
			document.getElementById('pfp-input').click();
		});

		// Update avatar when a new file is selected
		document.getElementById('pfp-input').addEventListener('change', async () => {
			const file = URL.createObjectURL(document.getElementById('pfp-input').files[0]);

			document.getElementById('profile-image').src = file;
			document.getElementById('sidebar-profile-image').src = file;
		});
	} catch (error) {
		console.error(error);
		popupSystem('error', i18n.t('user.data_load_error'));
		return;
	}
}
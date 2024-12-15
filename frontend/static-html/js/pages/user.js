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
				<h3>${i18n.t('user.game_history')}</h3>
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
		// Fetch user profile and stats
		const userData = await UserAPI.getProfile(username);
		const userStat = await UserAPI.getUserStats(username);

		// Fetch game history
		const gameHistory = await GameAPI.getUserGameHistory(username);

		// Set data
		document.getElementById('profile-image').src = `/media/${userData.pfp}`;
		document.getElementById('username-input').value = userData.username;
		document.getElementById('bio-input').value = userData.bio;
		document.getElementById('date-joined').innerText = new Date(userData.date_joined).toLocaleDateString();

		// Set stats
		document.getElementById('games-played').innerText = userStat.games_played;
		document.getElementById('win-rate').innerText = userStat.win_rate;

		// Populate game history
		const gameHistoryList = document.getElementById('game-history-list');
		if (gameHistory.length === 0) {
			gameHistoryList.innerHTML = `<p>${i18n.t('user.no_games')}</p>`;
		} else {
			gameHistoryList.innerHTML = gameHistory.map(game => `
			<div class="game-history-item">
				<div class="game-players">
					<span>${game.p1.username}</span>
					<span>vs</span>
					<span>${game.p2.username}</span>
				</div>
				<div class="game-score">
					<span>${game.p1_score} - ${game.p2_score}</span>
				</div>
				<div class="game-date">
					${new Date(game.time_start).toLocaleDateString()}
				</div>
			</div>
			`).join('');
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

			document.getElementById('username-input').value = updatedData.username;
			document.getElementById('bio-input').value = updatedData.bio;

			popupSystem('success', 'Profile updated successfully');
		});

		// Logout button
		document.getElementById('logout-button').addEventListener('click', async () => {
			await UserAPI.logout();
			navigate('/');
		});

		// Delete account button
		document.getElementById('delete-account-button').addEventListener('click', () => {
			document.getElementById('delete-confirmation').classList.remove('hidden');
		});

		// Confirm delete button
		document.getElementById('confirm-delete').addEventListener('click', async () => {
			await UserAPI.deleteAccount();
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
		popupSystem('error', 'Failed to load user data');
		return;
	}
}
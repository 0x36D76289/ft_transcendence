import { UserAPI } from '../api/user.js';
import { i18n } from '../services/i18n.js';
import { getUsername } from '../utils/cookies.js';
import { popupSystem } from '../services/popup.js';

export function render() {
	return `
<div class="profile-container">
	<div class="profile-header">
		<h2>${i18n.t('user.title')}</h2>
	</div>
	
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
						<span class="stat-label">${i18n.t('user.gamesPlayed')}</span>
					</div>
					<div class="stat-item">
						<span class="stat-value" id="win-rate">0%</span>
						<span class="stat-label">${i18n.t('user.winRate')}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="account-actions-card">
			<h3>${i18n.t('user.accountActions')}</h3>
			<div class="account-actions">
				<button id="logout-button" class="action-button logout-button">
					<span class="material-icons">logout</span>
					${i18n.t('user.logout')}
				</button>
				
				<button id="delete-account-button" class="action-button delete-button">
					<span class="material-icons">delete_forever</span>
					${i18n.t('user.deleteAccount')}
				</button>
			</div>

			<div id="delete-confirmation" class="delete-confirmation hidden">
				<p>${i18n.t('user.deleteConfirmation')}</p>
				<div class="confirmation-actions">
					<button id="confirm-delete" class="delete-button">
						${i18n.t('user.confirmDelete')}
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

		// Set data
		document.getElementById('profile-image').src = `/media/${userData.pfp}`;
		document.getElementById('username-input').value = userData.username;
		document.getElementById('bio-input').value = userData.bio;
		document.getElementById('date-joined').innerText = new Date(userData.date_joined).toLocaleDateString();

		// Set stats
		document.getElementById('games-played').innerText = userStat.games_played;
		document.getElementById('win-rate').innerText = userStat.win_rate;

		// Save profile button
		document.getElementById('save-profile').addEventListener('click', async () => {
			const newUsername = document.getElementById('username-input').value;
			const newBio = document.getElementById('bio-input').value;

			const updatedData = await UserAPI.updateProfile({
				username: newUsername,
				bio: newBio
			});

			popupSystem('success', 'Profile updated successfully');
		});

		// Logout button
		document.getElementById('logout-button').addEventListener('click', async () => {
			await UserAPI.logout();
			window.location.reload();
		});

		// Delete account button
		document.getElementById('delete-account-button').addEventListener('click', () => {
			document.getElementById('delete-confirmation').classList.remove('hidden');
		});

		// Confirm delete button
		document.getElementById('confirm-delete').addEventListener('click', async () => {
			await UserAPI.deleteAccount();
			window.location.reload();
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
			const file = document.getElementById('pfp-input').files[0];
			const updatedData = await UserAPI.updateProfile({}, file);

			document.getElementById('profile-image').src = `/media/${updatedData.pfp}`;
		});
	} catch (error) {
		console.error(error);
		popupSystem('error', 'Failed to load user data');
		return;
	}
}
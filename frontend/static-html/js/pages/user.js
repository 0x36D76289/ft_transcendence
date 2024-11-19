import { UserAPI } from '../api/user.js';
import { i18n } from '../services/i18n.js';
import { getUsername } from '../utils/cookies.js';
import { navigate } from '../app.js';

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
							<div class="avatar-placeholder"></div>
							<div class="status-indicator" id="status-indicator"></div>
						</div>
						
						<div class="profile-details">
							<div class="info-group">
								<label>${i18n.t('user.username')}</label>
								<input type="text" id="username-input" disabled />
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
							<button id="edit-profile" class="edit-button">
								${i18n.t('user.edit')}
							</button>
							<button id="save-profile" class="save-button hidden">
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
	const editButton = document.getElementById('edit-profile');
	const saveButton = document.getElementById('save-profile');
	const bioInput = document.getElementById('bio-input');
	const usernameInput = document.getElementById('username-input');
	const logoutButton = document.getElementById('logout-button');
	const deleteAccountButton = document.getElementById('delete-account-button');
	const deleteConfirmation = document.getElementById('delete-confirmation');
	const confirmDeleteButton = document.getElementById('confirm-delete');
	const cancelDeleteButton = document.getElementById('cancel-delete');

	try {
		// Fetch user profile
		const profile = await UserAPI.getProfile(username);
		const stats = await UserAPI.getStats(username);

		// Update UI with fetched data
		usernameInput.value = profile.username;
		bioInput.value = profile.bio || '';
		document.getElementById('date-joined').textContent = new Date(profile.date_joined).toLocaleDateString();
		document.getElementById('games-played').textContent = stats.games_played;
		document.getElementById('win-rate').textContent = `${stats.win_rate}%`;

		const avatarPlaceholder = document.querySelector('.avatar-placeholder');
		avatarPlaceholder.style.backgroundImage = `url(/media/pfp/default_pfp.svg)`;

		// Update online status indicator
		const statusIndicator = document.getElementById('status-indicator');
		statusIndicator.classList.add(profile.is_online ? 'online' : 'offline');
	} catch (error) {
		console.error('Failed to load profile:', error);
	}

	// Edit mode handling
	editButton.addEventListener('click', () => {
		bioInput.removeAttribute('disabled');
		editButton.classList.add('hidden');
		saveButton.classList.remove('hidden');
	});

	// Save profile changes
	saveButton.addEventListener('click', async () => {
		try {
			const updatedProfile = await UserAPI.updateUser(username, bioInput.value);
			bioInput.setAttribute('disabled', 'true');
			editButton.classList.remove('hidden');
			saveButton.classList.add('hidden');
			window.location.reload();
		} catch (error) {
			console.error('Failed to update profile:', error);
		}
	});

	// Logout handling
	logoutButton.addEventListener('click', async () => {
		try {
			await UserAPI.logout();
			navigate('/login');
		} catch (error) {
			console.error('Failed to logout:', error);
		}
	});

	// Delete account handling
	deleteAccountButton.addEventListener('click', () => {
		deleteConfirmation.classList.remove('hidden');
	});

	cancelDeleteButton.addEventListener('click', () => {
		deleteConfirmation.classList.add('hidden');
	});

	confirmDeleteButton.addEventListener('click', async () => {
		try {
			await UserAPI.deleteUser();
			window.location.reload();
		} catch (error) {
			console.error('Failed to delete account:', error);
		}
	});
}
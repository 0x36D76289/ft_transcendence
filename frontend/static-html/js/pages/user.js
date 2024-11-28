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
					<button id="edit-avatar-btn" class="edit-avatar-btn">
						<span class="material-icons">edit</span>
					</button>
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
	try {
		// Get the current username from cookies
		const username = getUsername();

		// Fetch user profile
		const profile = await UserAPI.getProfile(username);

		// Populate username input
		const usernameInput = document.getElementById('username-input');
		usernameInput.value = profile.username;

		// Populate bio textarea
		const bioInput = document.getElementById('bio-input');
		bioInput.value = profile.bio || '';

		// Set date joined
		const dateJoinedElement = document.getElementById('date-joined');
		dateJoinedElement.textContent = new Date(profile.date_joined).toLocaleDateString();

		// Set profile image
		const profileImage = document.getElementById('profile-image');
		profileImage.src = profile.pfp ? `/media/${profile.pfp}` : '/media/pfp/default_pfp.svg';

		// Fetch user stats
		const stats = await UserAPI.getUserStats(username);

		// Update stats
		const gamesPlayedElement = document.getElementById('games-played');
		const winRateElement = document.getElementById('win-rate');

		gamesPlayedElement.textContent = stats.games_played || 0;
		winRateElement.textContent = `${(stats.win_rate || 0).toFixed(1)}%`;

		// Setup save profile button
		const saveProfileButton = document.getElementById('save-profile');
		saveProfileButton.addEventListener('click', async () => {
			try {
				const updateData = {
					username: usernameInput.value,
					bio: bioInput.value
				};

				// Get profile picture file if selected
				const pfpFileInput = document.getElementById('pfp-file-input');
				const pfpFile = pfpFileInput?.files[0] || null;

				// Update profile
				await UserAPI.updateProfile(updateData, pfpFile);
				popupSystem('success', i18n.t('user.profileUpdated'));
				// window.location.reload();
			} catch (error) {
				console.error('Profile update error:', error);
			}
		});

		// Setup logout button
		const logoutButton = document.getElementById('logout-button');
		logoutButton.addEventListener('click', async () => {
			try {
				await UserAPI.logout();
				// Redirect to login page or home page
				
			} catch (error) {
				console.error('Logout error:', error);
			}
		});

		// Setup delete account logic
		const deleteAccountButton = document.getElementById('delete-account-button');
		const deleteConfirmation = document.getElementById('delete-confirmation');
		const confirmDeleteButton = document.getElementById('confirm-delete');
		const cancelDeleteButton = document.getElementById('cancel-delete');

		deleteAccountButton.addEventListener('click', () => {
			deleteConfirmation.classList.remove('hidden');
		});

		cancelDeleteButton.addEventListener('click', () => {
			deleteConfirmation.classList.add('hidden');
		});

		confirmDeleteButton.addEventListener('click', async () => {
			try {
				await UserAPI.deleteAccount();
				// Redirect to home or login page
				window.location.href = '/login';
			} catch (error) {
				console.error('Account deletion error:', error);
			}
		});

		// Setup avatar edit button (assuming you'll add file input)
		const editAvatarButton = document.getElementById('edit-avatar-btn');
		const pfpFileInput = document.createElement('input');
		pfpFileInput.type = 'file';
		pfpFileInput.accept = 'image/*';
		pfpFileInput.id = 'pfp-file-input';
		pfpFileInput.style.display = 'none';
		document.body.appendChild(pfpFileInput);

		editAvatarButton.addEventListener('click', () => {
			pfpFileInput.click();
		});

		pfpFileInput.addEventListener('change', async (event) => {
			const file = event.target.files[0];
			if (file) {
				try {
					await UserAPI.updateProfile({}, file);
					profileImage.src = URL.createObjectURL(file);
					popupSystem('success', i18n.t('user.avatarUpdated'));
				} catch (error) {
					console.error('Avatar update error:', error);
				}
			}
		});

	} catch (error) {
		console.error('Profile initialization error:', error);
		popupSystem('error', i18n.t('user.profileLoadError'));
	}
}
import { UserAPI } from '../api/user.js';
import { i18n } from '../services/i18n.js';
import { getUsername } from '../utils/cookies.js';

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
	const editAvatarBtn = document.getElementById('edit-avatar-btn');
	const avatarFileInput = document.getElementById('avatar-file-input');
	const profileImage = document.getElementById('profile-image');
	let selectedFile = null;

	try {
		// Fetch user profile
		const profile = await UserAPI.getProfile(getUsername());
		const stats = await UserAPI.getUserStats(getUsername());

		// Update UI with fetched data
		profileImage.src = "/media" + profile.pfp;
		document.getElementById('username-input').value = profile.username;
		document.getElementById('bio-input').value = profile.bio || '';
		document.getElementById('date-joined').textContent = new Date(profile.date_joined).toLocaleDateString();
		document.getElementById('games-played').textContent = stats.games_played;
		document.getElementById('win-rate').textContent = `${stats.win_rate}%`;
	} catch (error) {
		console.error('Failed to load profile:', error);
	}

	// Avatar editing functionality
	editAvatarBtn.addEventListener('click', () => {
		avatarFileInput.click();
	});

	avatarFileInput.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				profileImage.src = e.target.result;
				selectedFile = file;
			};
			reader.readAsDataURL(file);
		}
	});

	// Save profile changes
	document.getElementById('save-profile').addEventListener('click', async () => {
		try {
			await UserAPI.updateProfile({
				username: document.getElementById('username-input').value,
				bio: document.getElementById('bio-input').value
			}, selectedFile);
			window.location.reload();
		} catch (error) {
			console.error('Failed to update profile:', error);
		}
	});

	// Logout handling
	document.getElementById('logout-button').addEventListener('click', async () => {
		try {
			await UserAPI.logout();
			window.location.reload();
		} catch (error) {
			console.error('Failed to logout:', error);
		}
	});

	// Delete account handling
	document.getElementById('delete-account-button').addEventListener('click', () => {
		document.getElementById('delete-confirmation').classList.remove('hidden');
	});

	document.getElementById('cancel-delete').addEventListener('click', () => {
		document.getElementById('delete-confirmation').classList.add('hidden');
	});

	document.getElementById('confirm-delete').addEventListener('click', async () => {
		try {
			await UserAPI.deleteAccount();
			window.location.reload();
		} catch (error) {
			console.error('Failed to delete account:', error);
		}
	});
}
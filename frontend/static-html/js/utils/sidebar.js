import { getUserProfile } from '../api/user.js';
import { readCookie, eraseCookie } from '../cookie.js';
import { navigate } from '../spa.js';

const HTML = `
<div class="sidebar" id="sidebar">
	<div class="user-profile">
		<div class="user-pp-container">
			<img class="user-pp" src="" alt="">
		</div>
		<div class="user-info">
			<p class="user-username"></p>
			<p class="user-bio"></p>
			<p class="user-creation-date"></p>
			<p class="user-status"></p>
		</div>
	</div>

	<div class="nav-buttons">
		<div class="nav-button" data-nav="hub">
			<img class="nav-icon" src="https://api.iconify.design/mdi:home.svg" alt="Hub Icon">
			<span class="nav-text">Hub</span>
		</div>
		<div class="nav-button" data-nav="games">
			<img class="nav-icon" src="https://api.iconify.design/mdi:gamepad-variant.svg" alt="Games Icon">
			<span class="nav-text">Games</span>
		</div>
		<div class="nav-button" data-nav="friends">
			<img class="nav-icon" src="https://api.iconify.design/mdi:account-group.svg" alt="Friends Icon">
			<span class="nav-text">Friends</span>
		</div>
		<div class="nav-button" data-nav="tournaments">
			<img class="nav-icon" src="https://api.iconify.design/mdi:trophy.svg" alt="Tournaments Icon">
			<span class="nav-text">Tournaments</span>
		</div>
	</div>

	<div class="action-buttons">
		<button class="settings-btn">
			<img src="https://api.iconify.design/mdi:cog.svg" alt="Settings Icon" width="24" height="24">
		</button>
		<button class="logout-btn">
			<img src="https://api.iconify.design/mdi:logout.svg" alt="Logout Icon" width="24" height="24">
		</button>
	</div>
</div>
`;

const CSS = `
.sidebar {
	left: 0;
	top: 0;
	bottom: 0;
	width: var(--sidebar-width, 256px);
	background-color: rgba(0, 0, 0, 0.5);
	padding: 16px;
	border-radius: 24px;
	position: fixed;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease-in-out;
	z-index: 1000;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	transform: translateX(-100%);
}

.sidebar:hover {
	transform: translateX(0);
}

/* User Profile */
.user-profile {
	display: flex;
	align-items: center;
	border: 2px solid #4d4d4d;
	padding: 8px;
	border-radius: 16px;
	transition: all 0.3s ease;
	user-select: none;
	background: linear-gradient(145deg, #333333, #1a1a1a);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-pp {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	object-fit: cover;
}

.user-info {
	margin-left: 12px;
}

.user-username {
	margin-bottom: 4px;
	color: #cccccc;
}

.user-bio {
	margin-bottom: 4px;
	color: #999999;
}

.user-creation-date {
	font-size: 12px;
	color: #999999;
}

.user-status {
	font-size: 12px;
	color: #999999;
}

/* Navigation Buttons */
.nav-buttons {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.nav-button {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 12px;
	margin-bottom: 16px;
	border: 2px solid #1a1a1a;
	border-radius: 16px;
	user-select: none;
	background-color: #333333;
	color: #e6e6e6;
	transition: all 0.2s ease;
	box-shadow: 0 4px 0 0 #1a1a1a;
	text-align: left;
}

.nav-button img {
	width: 24px;
	height: 24px;
	filter: invert(100%);
	margin-right: 12px;
}

.nav-text {
	font-size: 18px;
	flex-grow: 1;
}

.nav-button:active {
	box-shadow: 0 0 0 0 #1a1a1a;
	transform: translateY(4px);
}

/* Action Buttons */
.action-buttons {
	display: flex;
	justify-content: center;
}

.action-buttons button {
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	border-radius: 50%;
	transition: all 0.3s ease;
}

.action-buttons button img {
	width: 24px;
	height: 24px;
	filter: invert(100%);
}

.action-buttons button:hover {
	background-color: #333333;
	transform: scale(1.1);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons button:active {
	background-color: #4d4d4d;
	transform: scale(0.95);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
	.sidebar {
		width: 100%;
		border-radius: 0;
	}
}
`;

export async function sidebarEvent() {
	const sidebar = document.getElementById('sidebar');
	if (!sidebar) return;

	const logoutBtn = sidebar.querySelector('.logout-btn');
	const settingsBtn = sidebar.querySelector('.settings-btn');
	const navButtons = sidebar.querySelectorAll('.nav-button');
	const userProfile = sidebar.querySelector('.user-profile');

	if (logoutBtn) {
		logoutBtn.addEventListener('click', function () {
			eraseCookie('token');
			eraseCookie('username');
			navigate('/login');
		});
	}

	if (settingsBtn) {
		settingsBtn.addEventListener('click', function () {
			navigate('/settings');
		});
	}

	navButtons.forEach(function (button) {
		button.addEventListener('click', function (event) {
			const nav = this.getAttribute('data-nav');
			if (nav) {
				navigate('/' + nav);
			}
		});
	});

	if (userProfile) {
		userProfile.addEventListener('click', function () {
			navigate('/profile');
		});
	}

	const username = readCookie('username');
	if (username) {
		const userJSON = await getUserProfile(username);

		if (userJSON) {
			const userPP = sidebar.querySelector('.user-pp');
			const userUsername = sidebar.querySelector('.user-username');
			const userBio = sidebar.querySelector('.user-bio');
			const userCreationDate = sidebar.querySelector('.user-creation-date');
			const userStatus = sidebar.querySelector('.user-status');

			if (userPP) {
				userPP.src = userJSON.pfp;
			}

			if (userUsername) {
				userUsername.textContent = userJSON.username;
			}

			if (userBio) {
				userBio.textContent = userJSON.bio || 'No bio available';
			}

			if (userCreationDate) {
				userCreationDate.textContent = `Member since ${new Date(userJSON.date_joined).toLocaleDateString()}`;
			}

			if (userStatus) {
				userStatus.textContent = userJSON.is_online ? 'Online' : `Last login: ${new Date(userJSON.last_login).toLocaleString()}`;
			}
		}

	}
}

export function initSidebar() {
	const token = readCookie('token');
	if (!token) {
		return ['', ''];
	}

	return [HTML, CSS];
}

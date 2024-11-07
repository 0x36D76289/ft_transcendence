// import { generateRandomUsers } from '../tests/createuser.js';
import { UserAPI } from '../api/user.js';
import { getCookie, getToken } from '../utils/cookies.js';

export function initSidebar() {
	const data = UserAPI.getProfile(getToken(), getCookie());

	const SIDEBAR = `
<nav id="sidebar" class="sidebar">
	<div class="sidebar-header">
			<span class="logo-text">ft_transcendance</span>
	</div>

	<div class="nav-items">
			<a href="/" class="nav-item active">
					<span class="material-icons nav-icon">home</span>
					<span class="nav-text">Accueil</span>
			</a>
			<a href="/friends" class="nav-item">
					<span class="material-icons nav-icon">group</span>
					<span class="nav-text">Friends</span>
			</a>
			<a href="/tournaments" class="nav-item">
					<span class="material-icons nav-icon">emoji_events</span>
					<span class="nav-text">Tournaments</span>
			</a>
			<a href="/messages" class="nav-item">
					<span class="material-icons nav-icon">message</span>
					<span class="nav-text">Messages</span>
			</a>
			<a href="/settings" class="nav-item">
					<span class="material-icons nav-icon">settings</span>
					<span class="nav-text">Paramètres</span>
			</a>
	</div>

	<a href="/user" class="profile">
			<img src="${data.pfp}" alt="Profile" class="profile-image">
			<div class="status-led"></div>
			<div class="profile-info">
				<span class="profile-name">${data.username}</span>
			</div>
	</a>
</nav>
`;

	const sidebar = document.createElement("div");
	sidebar.innerHTML = SIDEBAR;
	document.body.appendChild(sidebar);

	if (getCookie('guest') === 'true') {
		const profileLink = sidebar.querySelector('.profile');
		profileLink.href = '/login';
	}
}
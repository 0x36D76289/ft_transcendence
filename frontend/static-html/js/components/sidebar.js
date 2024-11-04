import { generateRandomUsers } from '../tests/createuser.js';

export function initSidebar() {
	const user = generateRandomUsers(1)[0];

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

	<div class="profile">
			<img src="${user.avatar}" alt="Profile" class="profile-image">
			<div class="status-led"></div>
			<div class="profile-info">
				<span class="profile-name">${user.name}</span>
			</div>
	</div>
</nav>
`;

	const sidebar = document.createElement("div");
	sidebar.innerHTML = SIDEBAR;
	document.body.appendChild(sidebar);
}
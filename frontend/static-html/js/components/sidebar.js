import { UserAPI } from "../api/user.js";
import { getUsername, getToken } from "../utils/cookies.js";
import { i18n } from "../services/i18n.js";

export async function initSidebar() {
	const user = await UserAPI.getProfile(getUsername());

	if (!user) {
		return;
	}

	const sidebar = document.createElement("div");
	sidebar.innerHTML = `
<nav id="sidebar" class="sidebar">
	<div class="sidebar-header">
		<span class="logo-text" data-i18n="sidebar.title">${i18n.t("sidebar.title")}</span>
	</div>

	<div class="nav-items">
		<a href="/" class="nav-item active">
			<span class="material-icons nav-icon">home</span>
			<span class="nav-text" data-i18n="sidebar.home">${i18n.t("sidebar.home")}</span>
		</a>
		<a href="/friends" class="nav-item">
			<span class="material-icons nav-icon">group</span>
			<span class="nav-text" data-i18n="sidebar.friends">${i18n.t("sidebar.friends")}</span>
		</a>
		<a href="/tournaments" class="nav-item">
			<span class="material-icons nav-icon">emoji_events</span>
			<span class="nav-text" data-i18n="sidebar.tournaments">${i18n.t("sidebar.tournaments")}</span>
		</a>
		<a href="/messages" class="nav-item">
			<span class="material-icons nav-icon">message</span>
			<span class="nav-text" data-i18n="sidebar.messages">${i18n.t("sidebar.messages")}</span>
		</a>
		<a href="/settings" class="nav-item">
			<span class="material-icons nav-icon">settings</span>
			<span class="nav-text" data-i18n="sidebar.settings">${i18n.t("sidebar.settings")}</span>
		</a>
	</div>

	<a href="/user" class="profile">
		<img id="sidebar-profile-image" src="/media/${user.pfp}" alt="${i18n.t("sidebar.profile.alt")}" class="profile-image">
		<div class="status-led ${user.is_online ? "online" : "offline"}"></div>
		<div class="profile-info">
			<span id="sidebar-profile-name" class="profile-name">${user.username}</span>
		</div>
	</a>
</nav>
`;

	const oldSidebar = document.getElementById("sidebar");
	if (oldSidebar) {
		oldSidebar.remove();
	}

	document.body.appendChild(sidebar);

	if (getToken() === null || UserAPI.isTokenValid(getToken()) === false) {
		sidebar.querySelector(".profile").style.display = "none";
	}
}

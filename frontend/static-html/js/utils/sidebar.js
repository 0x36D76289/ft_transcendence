import { getUserProfile } from '../api/user.js';
import { readCookie, eraseCookie } from '../cookie.js';
import { navigate } from '../spa.js';

const HTML = `
<div class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <img src="logo.png" alt="Logo" class="logo">
    </div>
    <nav class="nav-buttons">
        <a href="#" class="nav-button" data-nav="hub">
            <svg class="nav-icon"><use xlink:href="#icon-home"></use></svg>
            <span class="nav-text">Hub</span>
        </a>
        <a href="#" class="nav-button" data-nav="games">
            <svg class="nav-icon"><use xlink:href="#icon-games"></use></svg>
            <span class="nav-text">Games</span>
        </a>
        <a href="#" class="nav-button" data-nav="friends">
            <svg class="nav-icon"><use xlink:href="#icon-friends"></use></svg>
            <span class="nav-text">Friends</span>
        </a>
        <a href="#" class="nav-button" data-nav="tournaments">
            <svg class="nav-icon"><use xlink:href="#icon-tournaments"></use></svg>
            <span class="nav-text">Tournaments</span>
        </a>
    </nav>
    <div class="sidebar-footer">
        <button class="action-button settings-btn">
            <svg class="action-icon"><use xlink:href="#icon-settings"></use></svg>
        </button>
        <button class="action-button logout-btn">
            <svg class="action-icon"><use xlink:href="#icon-logout"></use></svg>
        </button>
        <div class="user-profile">
            <img class="user-avatar" src="" alt="User Avatar">
            <div class="user-info">
                <p class="user-name"></p>
                <p class="user-email"></p>
            </div>
        </div>
    </div>
</div>
`;

const CSS = `
.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--sidebar-width, 256px);
    background-color: var(--gray10);
    color: var(--gray90);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    overflow-y: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
    padding: var(--padding-m);
    text-align: center;
}

.logo {
    max-width: 100px;
    height: auto;
}

.nav-buttons {
    flex-grow: 1;
    padding: var(--padding-s) 0;
}

.nav-button {
    display: flex;
    align-items: center;
    padding: var(--padding-s) var(--padding-m);
    color: var(--gray80);
    transition: background-color 0.2s ease;
    text-decoration: none;
}

.nav-button:hover,
.nav-button:focus {
    background-color: var(--gray20);
}

.nav-icon {
    width: 24px;
    height: 24px;
    margin-right: var(--margin-s);
    fill: currentColor;
}

.nav-text {
    font: var(--pui);
}

.sidebar-footer {
    padding: var(--padding-m);
    border-top: 1px solid var(--gray30);
}

.action-button {
    background: none;
    border: none;
    color: var(--gray80);
    cursor: pointer;
    padding: var(--padding-xs);
    margin-right: var(--margin-s);
}

.action-icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
}

.user-profile {
    display: flex;
    align-items: center;
    margin-top: var(--margin-m);
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: var(--margin-s);
}

.user-info {
    font: var(--smallui);
}

.user-name {
    font-weight: bold;
}

.user-email {
    color: var(--gray60);
}

@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.active {
        transform: translateX(0);
    }

    .sidebar-toggle {
        display: block;
        position: fixed;
        left: 10px;
        top: 10px;
        z-index: 1001;
        background: var(--gray20);
        border: none;
        color: var(--gray90);
        padding: var(--padding-xs);
        border-radius: 4px;
    }
}

@media (min-width: 769px) {
    .sidebar-toggle {
        display: none;
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

	const sidebarToggle = document.createElement('button');
	sidebarToggle.classList.add('sidebar-toggle');
	sidebarToggle.innerHTML = '<svg class="nav-icon"><use xlink:href="#icon-menu"></use></svg>';
	document.body.appendChild(sidebarToggle);

	sidebarToggle.addEventListener('click', () => {
		sidebar.classList.toggle('active');
	});
}

export function initSidebar() {
	const token = readCookie('token');
	if (!token) {
		return ['', ''];
	}

	return [HTML, CSS];
}

import { getData } from '../api/utils.js';
import { readCookie, eraseCookie } from '../cookie.js';
import { navigate } from '../spa.js';

const HTML = `
<div class="sidebar" id="sidebar">
	<div class="user-profile">
		<div class="user-pp-container">
			<img class="user-pp"
				src=""
				alt="">
		</div>
		<div class="user-info">
			<p class="user-username"></p>
			<p class="user-creation-date"></p>
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
`


const CSS = `
.sidebar {
	left: var(--padding-xs);
	top: var(--padding-xs);
	bottom: var(--padding-xs);
	width: var(--sidebar-width);
	background-color: rgba(0, 0, 0, 0.5);
	padding: var(--padding-m);
	border-radius: calc(var(--padding-m) * 1.5);
	position: fixed;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: 0 0 var(--padding-m) rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease-in-out;
	z-index: 1;
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
	border: 2px solid var(--gray30);
	padding: var(--padding-xs);
	border-radius: calc(var(--padding-xs) * 2);
	transition: background-color var(--transition), transform var(--transition), box-shadow var(--transition);
	user-select: none;
	background: linear-gradient(145deg, var(--gray20), var(--gray10));
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);

	.user-pp {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		overflow: hidden;
		display: block;
		align-self: center;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
	}

	.user-info {
		margin-left: var(--margin-s);
		margin-top: var(--margin-xxs);
		margin-bottom: var(--margin-xxs);

		.user-username {
			margin-bottom: var(--margin-xxs);
		}

		.user-creation-date {
			font-size: small;
			color: var(--gray60);
		}
	}

	.user-info p {
		font-size: smaller;
		color: var(--gray80);
	}
}

/* Hover state */
.user-profile:hover {
	background-color: var(--gray20);
	transform: scale(1.05);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
}

/* Active state */
.user-profile:active {
	background-color: var(--gray30);
	transform: scale(0.98);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Navigation Buttons */
.nav-buttons {
	display: flex;
	flex-direction: column;
	justify-content: center;

	.nav-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--padding-s);
		margin-bottom: var(--margin-m);
		border: 2px solid var(--gray10);
		border-radius: 16px;
		/* cursor: pointer; */
		user-select: none;
		background-color: var(--gray20);
		color: var(--gray90);
		transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
		box-shadow: 0px 4px 0 0 var(--gray10);
		/* Shadow from bottom to top */
		text-align: center;

		img {
			width: var(--padding-m);
			height: var(--padding-m);
			filter: invert(100%);
			margin-right: var(--margin-s);
		}

		.nav-text {
			font-size: 1.1rem;
			flex-grow: 1;
		}
	}

	.nav-button:active {
		box-shadow: 0px 0px 0 0 var(--gray10);
		transform: translateY(4px);
	}
}

.action-buttons {
	display: flex;
	justify-content: center;

	button {
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--padding-xs);
		border-radius: 50%;
		transition: background-color var(--transition), transform var(--transition), box-shadow var(--transition);

		img {
			width: var(--padding-m);
			height: var(--padding-m);
			filter: invert(100%);
		}

		&:hover {
			background-color: var(--gray20);
			transform: scale(1.1);
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
		}

		&:active {
			background-color: var(--gray30);
			transform: scale(0.95);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}
	}
}
`
export function siderbarEvent() {
	document.querySelector('.logout-btn').addEventListener('click', () => {
		eraseCookie('token');
		eraseCookie('username');
		navigate('/login');
	});

	document.querySelector('.settings-btn').addEventListener('click', () => {
		navigate('/settings');
	});

	document.querySelectorAll('.nav-button').forEach(button => {
		button.addEventListener('click', event => {
			const nav = event.currentTarget.dataset.nav;
			navigate(`/${nav}`);
		});
	});

	document.querySelector('.user-profile').addEventListener('click', () => {
		navigate('/profile');
	});

	const username = readCookie('username');

	if (username) {
		getData(`/users/profile/${username}`)
			.then(response => {
				try {
					const data = JSON.parse(response);
					document.querySelector('.user-pp').src = data.profile_picture_url;
					document.querySelector('.user-username').textContent = data.username;
					document.querySelector('.user-creation-date').textContent = `Joined: ${new Date(data.date_joined).toLocaleDateString()}`;
				} catch (error) {
					console.error('Failed to parse JSON response:', error);

				}
			}).catch(error => {
				console.error('Failed to fetch user profile:', error);
				document.querySelector('.user-username').textContent = 'Guest';
				document.querySelector('.user-creation-date').textContent = 'Please log in';
				document.querySelector('.user-pp').src = 'https://api.iconify.design/mdi:account-circle.svg';
			});
	}
}

export function initSidebar() {
	const token = readCookie('token');
	if (!token) {
		return ['', ''];
	}

	return [HTML, CSS];
}

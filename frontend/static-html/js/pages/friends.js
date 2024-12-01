import { UserAPI } from '../api/user.js';
import { ChatAPI } from '../api/chat.js';
import { popupSystem } from '../services/popup.js';
import { getUsername } from '../utils/cookies.js';
import { i18n } from '../services/i18n.js';
import { navigate } from '../app.js';
import { online_sock } from '../api/socket.js';

function createContactCard(friend) {
	let status = friend.is_online ? i18n.t('friends.online') : i18n.t('friends.offline');
	return `
	<div class="contact-card" data-user-id="${friend.username}">
		<img src="/media/${friend.pfp}" alt="${friend.username}" class="contact-avatar">
		<h3 class="contact-username">${friend.username}</h3>
		<p class="contact-status" data-status="${status}">
				${status}
		</p>
	</div>
	`;
}

function createProfilePreviewPopup(userData, userStats) {
	return `
	<div id="profile-preview-overlay" class="profile-preview-overlay">
		<div class="profile-preview-container">
			<button id="close-preview" class="close-preview-btn">
				<span class="material-icons">close</span>
			</button>
			<div class="profile-preview-content">
				<div class="profile-preview-avatar">
					<img src="/media/${userData.pfp}" alt="${userData.username}" class="preview-avatar">
				</div>
				<h2 class="preview-username">${userData.username}</h2>
				<p class="preview-bio">${userData.bio || i18n.t('user.no_bio')}</p>
				
				<div class="preview-stats">
					<div class="stat-item">
						<span class="stat-value">${userStats.games_played}</span>
						<span class="stat-label">${i18n.t('user.games_played')}</span>
					</div>
					<div class="stat-item">
						<span class="stat-value">${userStats.win_rate}%</span>
						<span class="stat-label">${i18n.t('user.win_rate')}</span>
					</div>
				</div>
				
				<div class="profile-actions">
					<button class="profile-action-btn message" title="${i18n.t('friends.send_message')}">
						<span class="material-icons">chat</span>
					</button>
					<button class="profile-action-btn play" title="${i18n.t('friends.invite_to_play')}">
						<span class="material-icons">sports_esports</span>
					</button>
					<button class="profile-action-btn block" title="${i18n.t('friends.block')}">
						<span class="material-icons">block</span>
					</button>
					<button class="profile-action-btn remove" title="${i18n.t('friends.remove')}">
						<span class="material-icons">delete</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	`;
}

export function render() {
	return `
<section class="contacts-container">
	<header class="friends-header">
		<h1>${i18n.t('friends.title')}</h1>
	</header>

	<div class="search-container">
		<input type="text" id="searchInput" placeholder="${i18n.t('friends.search_user')}" class="search-input">
		<button id="addFriendBtn" class="add-friend-btn">
			<span class="material-icons">person_add</span>
		</button>
	</div>

	<div id="contactGrid" class="contact-grid"></div>

	<button id="scrollTopBtn" class="scroll-top-btn">
		<span class="material-icons">arrow_upward</span>
	</button>
</section>
	`;
}

function initScrollTopButton() {
	const scrollBtn = document.getElementById('scrollTopBtn');
	const scrollThreshold = 300;

	window.addEventListener('scroll', () => {
		if (window.scrollY > scrollThreshold) {
			scrollBtn.classList.add('visible');
		} else {
			scrollBtn.classList.remove('visible');
		}
	});

	scrollBtn.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});
}

async function handleActionButton(event) {
	const action = event.currentTarget.classList[1];
	const username = document.querySelector('.preview-username').textContent;

	switch (action) {
		case 'message':
			await ChatAPI.createChat(username);
			break;
		case 'play':
			online_sock.send("fight " + username);
			popupSystem('info', i18n.t('friends.invite_to_play') + ' ' + username);
			return;
		case 'block':
			await ChatAPI.blockUser(username);
			popupSystem('info', i18n.t('friends.block'));
			break;
		case 'remove':
			await UserAPI.removeFriendRequest(username);
			popupSystem('info', i18n.t('friends.remove'));
			break;
		default:
			console.error('Unknown action:', action);
			break;
	}
	document.getElementById('profile-preview-overlay').remove();
	navigate('/friends');
}

async function showProfilePreview(username) {
	try {
		// Fetch user profile and stats
		const userData = await UserAPI.getProfile(username);
		const userStats = await UserAPI.getUserStats(username);

		// Create and insert popup
		const popupHTML = createProfilePreviewPopup(userData, userStats);
		document.body.insertAdjacentHTML('beforeend', popupHTML);

		// Close button
		document.getElementById('close-preview').addEventListener('click', () => {
			document.getElementById('profile-preview-overlay').remove();
		});

		// Close on outside click
		document.getElementById('profile-preview-overlay').addEventListener('click', (e) => {
			if (e.target.id === 'profile-preview-overlay') {
				e.target.remove();
			}
		});

		// Add event listeners for profile action buttons
		const actionButtons = document.querySelectorAll('.profile-action-btn');
		actionButtons.forEach((button) => {
			button.addEventListener('click', handleActionButton);
		});
	} catch (error) {
		console.error('Failed to load profile preview:', error);
		popupSystem('error', i18n.t('friends.profile_load_error'));
	}
}

function renderContacts(friends) {
	const contactGrid = document.getElementById('contactGrid');
	contactGrid.innerHTML = '';

	for (let user in friends[0]) {
		if (user == "status")
			continue;
		let e = document.createElement("div");
		e.innerHTML = createContactCard(friends[0][user]);
		contactGrid.appendChild(e);
	}

	const contactCards = document.querySelectorAll('.contact-card');
	contactCards.forEach((card) => {
		card.addEventListener('click', () => {
			const username = card.dataset.userId;
			showProfilePreview(username);
		});
	});
}

export async function init() {
	const searchInput = document.getElementById('searchInput');
	const addFriendBtn = document.getElementById('addFriendBtn');

	let friends = await UserAPI.getFriends(getUsername());

	searchInput.addEventListener('input', () => {
		const query = searchInput.value.toLowerCase();
		const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(query));
		renderContacts(filteredFriends);
	});

	addFriendBtn.addEventListener('click', async () => {
		await UserAPI.sendFriendRequest(searchInput.value);
		popupSystem('info', i18n.t('friends.friend_request_sent'));
	});

	renderContacts(friends);	
	initScrollTopButton();
}

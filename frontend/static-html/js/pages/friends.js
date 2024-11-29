import { UserAPI } from '../api/user.js';
import { ChatAPI } from '../api/chat.js';
import { popupSystem } from '../services/popup.js';
import { getUsername } from '../utils/cookies.js';
import { i18n } from '../services/i18n.js';
import { navigate } from '../app.js';

function createContactCard(user) {
	return `
	<div class="contact-card" data-user-id="${user.username}">
		<img src="/media/${user.pfp}" alt="${user.username}" class="contact-avatar">
		<h3 class="contact-username">${user.username}</h3>
		<p class="contact-status" data-status="${user.status}">
				${user.status === 'online' ? i18n.t('friends.online') : i18n.t('friends.offline')}
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
						<span class="stat-label">${i18n.t('user.gamesPlayed')}</span>
					</div>
					<div class="stat-item">
						<span class="stat-value">${userStats.win_rate}%</span>
						<span class="stat-label">${i18n.t('user.winRate')}</span>
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
			const chatId = await ChatAPI.createChat(username);
			navigate(`/chat/${chatId}`);
			break;
		case 'play':
			popupSystem('info', i18n.t('friends.invite_to_play'));
			break;
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

export async function init() {
	const searchInput = document.getElementById("searchInput");
	const addFriendButton = document.createElement('button');
	addFriendButton.innerHTML = `
    <span class="material-icons">person_add</span>
	`;
	addFriendButton.classList.add('add-friend-btn');
	addFriendButton.title = i18n.t('friends.add_friend_tooltip');
	searchInput.parentNode.insertBefore(addFriendButton, searchInput.nextSibling);

	async function addFriend() {
		const username = searchInput.value.trim();

		if (!username) {
			popupSystem('error', i18n.t('friends.empty_username'));
			return;
		}

		try {
			await UserAPI.sendFriendRequest(username);
			popupSystem('success', i18n.t('friends.request_sent', { username }));
			searchInput.value = ''; 

			await updateFriendsList();
		} catch (error) {
			console.error('Friend request error:', error);
		}
	}

	// Ajouter un ami via le bouton
	addFriendButton.addEventListener('click', addFriend);

	// Ajouter un ami via la touche Entrée
	searchInput.addEventListener('keyup', async (event) => {
		if (event.key === 'Enter') {
			await addFriend();
		}
	});

	// Charger et afficher la liste des amis
	async function updateFriendsList() {
		const list = document.getElementById("contactGrid");
		list.innerHTML = ''; // Vider la liste existante

		try {
			const friends = await UserAPI.getFriends(getUsername());

			for (let user in friends[0]) {
				if (user === "status") continue;

				const friendCard = document.createElement("div");
				friendCard.innerHTML = createContactCard(friends[0][user]);
				list.appendChild(friendCard);

				friendCard.querySelector('.contact-card').addEventListener('click', () => {
					showProfilePreview(friends[0][user].username);
				});
			}
		} catch (error) {
			console.error('Error fetching friends:', error);
			popupSystem('error', i18n.t('friends.fetch_error'));
		}
	}

	// Initialiser la liste des amis au chargement
	await updateFriendsList();

	// Initialiser le bouton de défilement
	initScrollTopButton();
}
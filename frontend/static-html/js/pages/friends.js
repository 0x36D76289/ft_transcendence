import { UserAPI } from '../api/user.js';
import { popupSystem } from '../services/popup.js';
import { getUsername } from '../utils/cookies.js';

function createContactCard(user) {
	const lastActive = new Date(user.last_active);
	const now = new Date();
	const diffTime = Math.abs(now - lastActive);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return `
<div class="contact-card" data-user-id="${user.id}">
	<div class="contact-avatar">
		<img src="${user.pfp}" alt="${user.username}">
		<div class="status-indicator status-${user.is_online ? 'online' : 'offline'}"></div>
	</div>
	<div class="contact-info">
		<div class="contact-name">${user.username}</div>
		<div class="contact-status">${user.is_online ? 'En ligne' : 'Hors ligne'}</div>
		<div class="contact-last-active">Dernière activité : ${diffDays} jours</div>
	</div>
	<div class="contact-expanded-content">
		<div class="contact-bio">
			${user.bio || "Aucune biographie disponible"}
		</div>
		<div class="contact-actions">
			<button class="contact-action-btn message">
				<span class="material-icons">chat</span>
				Message
			</button>
			<button class="contact-action-btn play">
				<span class="material-icons">sports_esports</span>
				Jouer
			</button>
			<button class="contact-action-btn block">
				<span class="material-icons">block</span>
				Bloquer
			</button>
			<button class="contact-action-btn remove">
				<span class="material-icons">person_remove</span>
				Supprimer
			</button>
		</div>
	</div>
</div>
	`;
}

export function render() {
	return `
<div class="app-container">
	<main class="main-content">
		<div class="sort-bar">
			<input type="text" id="searchInput" placeholder="Rechercher...">
			<button class="sort-button active" data-sort="all">Tous</button>
			<button class="sort-button" data-sort="online">En ligne</button>
			<button class="sort-button" data-sort="offline">Hors ligne</button>
			<button class="sort-button" data-sort="name">Nom A-Z</button>
			<button class="sort-button" data-sort="activity">Dernière activité</button>
		</div>

		<div class="contact-grid" id="contactGrid">
			<!-- Les cartes de contact seront générées ici -->
		</div>
	</main>
	<button id="scrollTopBtn" class="scroll-top-btn" aria-label="Retour en haut">
		<span class="material-icons">arrow_upward</span>
	</button>
</div>
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

}

export async function init() {
	var search_input = document.getElementById("searchInput");
	search_input.onkeyup = async function (key) {
		if (key.key == "Enter") {
			console.log(await UserAPI.sendFriendRequest(search_input.value));
			//append
		}
	};

	var list = document.getElementById("contactGrid");
	let friends = await UserAPI.getFriends(getUsername());
	console.log(friends[0]);
	for (let user in friends[0]) {
		if (user == "status")
			continue;
		let e = document.createElement("div");
		e.innerHTML = createContactCard(friends[0][user]);
		list.appendChild(e);
	}
}

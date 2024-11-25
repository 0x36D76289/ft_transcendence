// import { createAndAddFriends } from '../tests/createuser.js';
import { UserAPI } from '../api/user.js';

async function createContactCard(user) {
	const lastLoginDate = new Date(user.last_login);
	const now = new Date();
	const timeDiff = Math.abs(now - lastLoginDate);
	const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

	return `
<div class="contact-card" data-user-id="${user.id}">
	<div class="contact-avatar">
		<img src="${user.pfp}" alt="${user.username}">
		<div class="status-indicator status-${user.is_online}"></div>
	</div>
	<div class="contact-info">
		<div class="contact-name">${user.username}</div>
		<div class="contact-status">${user.is_online === 'online' ? 'En ligne' : 'Hors ligne'}</div>
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

export async function render() {
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

function handleCardClick(event) {
	const card = event.target.closest('.contact-card');
	if (!card) return;

	if (event.target.closest('.contact-action-btn')) {
		handleActionButton(event);
		return;
	}

	const wasExpanded = card.classList.contains('expanded');

	// Ferme les autres cartes avec une animation
	document.querySelectorAll('.contact-card.expanded').forEach(expandedCard => {
		if (expandedCard !== card) {
			expandedCard.classList.remove('expanded');
		}
	});

	card.classList.toggle('expanded');

	// Attend la fin de l'animation avant de scroll
	if (!wasExpanded) {
		setTimeout(() => {
			card.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}, 50);
	}
}

function handleActionButton(event) {
	const button = event.target.closest('.contact-action-btn');
	if (!button) return;

	const card = button.closest('.contact-card');
	const userId = card.dataset.userId;

	if (button.classList.contains('message')) {
		// Handle message action
		console.log('Message user:', userId);
	} else if (button.classList.contains('block')) {
		// Handle block action
		console.log('Block user:', userId);
		card.remove();
	} else if (button.classList.contains('remove')) {
		// Handle remove action
		console.log('Remove user:', userId);
		card.remove();
	} else if (button.classList.contains('play')) {
		// Handle play action
		console.log('Play with user:', userId);
	}
}

export async function init() {
	const users = await UserAPI.getFriends();

	// Remplir la grille avec les cartes
	const contactGrid = document.getElementById('contactGrid');
	contactGrid.innerHTML = users.map(user => createContactCard(user)).join('');
	contactGrid.addEventListener('click', handleCardClick);

	const sortButtons = document.querySelectorAll('.sort-button');
	sortButtons.forEach(button => {
		button.addEventListener('click', () => {
			sortButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');

			const sortType = button.dataset.sort;
			let sortedUsers = [...users];

			switch (sortType) {
				case 'online':
					sortedUsers = users.filter(user => user.is_online === 'online');
					break;
				case 'offline':
					sortedUsers = users.filter(user => user.is_online === 'offline');
					break;
				case 'name':
					sortedUsers.sort((a, b) => a.username.localeCompare(b.username));
					break;
				case 'activity':
					sortedUsers.sort((a, b) => {
						return new Date(b.last_login) - new Date(a.last_login);
					});
					break;
			}

			contactGrid.innerHTML = sortedUsers.map(user => createContactCard(user)).join('');
		});
	});

	const searchInput = document.getElementById('searchInput');
	searchInput.addEventListener('input', () => {
		const query = searchInput.value.toLowerCase();
		const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query));
		contactGrid.innerHTML = filteredUsers.map(user => createContactCard(user)).join('');
	});

	initScrollTopButton();
}

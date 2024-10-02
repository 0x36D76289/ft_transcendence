import { loadPage } from '../spa.js';
import { initSidebar, siderbarEvent } from '../utils/sidebar.js';
import { getData } from '../api/utils.js';

const HTML = `
<div class="friends-page">
  <div class="search-bar">
    <input type="text" placeholder="Rechercher" />
  </div>
  <div class="friends-list">
    <div class="friends-header">EN LIGNE — 21</div>
    <!-- Friend items will be dynamically added here -->
  </div>
</div>
`;

const CSS = `
.friends-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #36393f, #2f3136);
  color: var(--gray90);
  font-family: var(--ff2);
}

.search-bar {
  padding: var(--padding-m);
  background-color: rgba(0, 0, 0, 0.2);
}

.search-bar input {
  width: 100%;
  padding: var(--padding-s);
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 4px;
  color: var(--gray90);
  font: var(--pui);
}

.search-bar input::placeholder {
  color: var(--gray60);
}

.friends-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: var(--padding-s);
}

.friends-header {
  font: var(--smallui);
  color: var(--gray60);
  margin-bottom: var(--margin-s);
  padding-left: var(--padding-s);
}

.friend-item {
  display: flex;
  align-items: center;
  padding: var(--padding-s);
  border-radius: 4px;
  margin-bottom: 2px;
  transition: background-color 0.2s ease;
}

.friend-item:hover {
  background-color: rgba(79, 84, 92, 0.3);
}

.friend-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: var(--margin-s);
  position: relative;
}

.friend-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.friend-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #36393f;
}

.friend-status.online {
  background-color: #43b581;
}

.friend-status.offline {
  background-color: #747f8d;
}

.friend-info {
  flex-grow: 1;
}

.friend-username {
  font: var(--pui);
  color: var(--gray90);
}

.friend-activity {
  font: var(--smallui);
  color: var(--gray60);
}

.friend-actions {
  display: flex;
  align-items: center;
}

.friend-action {
  width: 24px;
  height: 24px;
  margin-left: var(--margin-xs);
  color: var(--gray60);
  cursor: pointer;
  transition: color 0.2s ease;
}

.friend-action:hover {
  color: var(--gray90);
}

/* Scrollbar styles */
.friends-list::-webkit-scrollbar {
  width: 8px;
}

.friends-list::-webkit-scrollbar-thumb {
  background-color: rgba(79, 84, 92, 0.3);
  border-radius: 4px;
}

.friends-list::-webkit-scrollbar-track {
  background-color: transparent;
}
`;

export function friends() {
	const [sidebarHTML, sidebarCSS] = initSidebar();

	const loadHTML = `
	${sidebarHTML}
	${HTML}
	`;
	const loadCSS = `
	${sidebarCSS}
	${CSS}
	`;

	loadPage(loadHTML, loadCSS);
	siderbarEvent();

	// getData('/friends/list')
	// 	.then(response => {
	// 		try {
	// 			const friendsData = JSON.parse(response);
	// 			const friendsList = document.querySelector('.friends-list');

	// 			friendsData.forEach(friend => {
	// 				const friendCard = document.createElement('div');
	// 				friendCard.classList.add('friend-card');
	// 				if (friend.online) friendCard.classList.add('online');

	// 				friendCard.innerHTML = `
  //           <img class="friend-pp" src="${friend.profile_picture_url}" alt="${friend.username}'s profile picture">
  //           <div class="friend-info">
  //             <p class="friend-username">${friend.username}</p>
  //             <p class="friend-status">${friend.online ? 'Online' : 'Offline'}</p>
  //           </div>
  //         `;

	// 				friendsList.appendChild(friendCard);
	// 			});
	// 		} catch (error) {
	// 			console.error('Failed to parse friends data:', error);
	// 		}
	// 	})
	// 	.catch(error => {
	// 		console.error('Failed to fetch friends list:', error);
	// 	});

	const friendsList = document.querySelector('.friends-list');

	// Temporary random friends data
	const randomFriends = [
		{ username: 'Alice', profile_picture_url: 'https://via.placeholder.com/80', online: true },
		{ username: 'Bob', profile_picture_url: 'https://via.placeholder.com/80', online: false },
		{ username: 'Charlie', profile_picture_url: 'https://via.placeholder.com/80', online: true },
	];

	randomFriends.forEach(friend => {
		const friendCard = document.createElement('div');
		friendCard.classList.add('friend-card');
		if (friend.online) friendCard.classList.add('online');

		friendCard.innerHTML = `
      <img class="friend-pp" src="${friend.profile_picture_url}" alt="${friend.username}'s profile picture">
      <div class="friend-info">
        <p class="friend-username">${friend.username}</p>
        <p class="friend-status">${friend.online ? 'Online' : 'Offline'}</p>
      </div>
		`;

		friendsList.appendChild(friendCard);
	});
}

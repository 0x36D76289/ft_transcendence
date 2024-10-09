import { getUserProfile, getUserStats, sendFriendRequest } from '../api/user.js';
import { loadPage } from '../spa.js';

const HTML = `
<div class="profile-page">
	<div class="profile-header">
		<h1 class="username"></h1>
		<button class="friend-request-btn">Add Friend</button>
	</div>
	<div class="profile-bio"></div>
	<div class="profile-stats">
		<h2>Game Stats</h2>
		<ul class="stats-list"></ul>
	</div>
</div>
`;

const CSS = `
.profile-page {
	padding: var(--padding-m);
}

.profile-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: var(--margin-l);
}

.username {
	font: var(--h1);
}

.friend-request-btn {
	padding: var(--padding-s);
	background-color: var(--color-primary);
	color: var(--text-light);
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color var(--transition);
}

.friend-request-btn:hover {
	background-color: var(--color-secondary);
}

.profile-bio {
	font: var(--p);
	margin-bottom: var(--margin-l);
}

.profile-stats {
	font: var(--p);
}

.stats-list {
	list-style: none;
	padding: 0;
}

.stats-list li {
	margin-bottom: var(--margin-s);
}
`;

export async function profile(username) {
	const loadHTML = HTML;
	const loadCSS = CSS;

	loadPage(loadHTML, loadCSS);

	try {
		const profileData = await getUserProfile(username);
		const statsData = await getUserStats(username);

		document.querySelector('.username').textContent = profileData.username;
		document.querySelector('.profile-bio').textContent = profileData.bio;

		const statsList = document.querySelector('.stats-list');
		statsData.forEach(stat => {
			const li = document.createElement('li');
			li.textContent = `${stat.name}: ${stat.value}`;
			statsList.appendChild(li);
		});

		document.querySelector('.friend-request-btn').addEventListener('click', async () => {
			await sendFriendRequest(username);
			alert('Friend request sent!');
		});
	} catch (error) {
		console.error('Error loading profile:', error);
	}
}
import { getUserProfile, getUserStats, sendFriendRequest } from '../api/user.js';
import { loadPage } from '../spa.js';
import { eventBackground, initBackground } from '../utils/background.js';

const HTML = `
<div class="profile-page">
	<canvas id="backgroundCanvas"></canvas>
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
	position: relative;
	z-index: 1;
	color: black;
}

.profile-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: var(--margin-l);
	color: black;
}

.username {
	font: var(--h1);
	color: black;
}

.friend-request-btn {
	padding: var(--padding-s);
	background-color: var(--color-primary);
	color: var(--text-light);
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color var(--transition);
	color: black;
}

.friend-request-btn:hover {
	background-color: var(--color-secondary);
}

.profile-bio {
	font: var(--p);
	margin-bottom: var(--margin-l);
	color: black;
}

.profile-stats {
	font: var(--p);
	color: black;
}

.stats-list {
	list-style: none;
	padding: 0;
	color: black;
}

.stats-list li {
	margin-bottom: var(--margin-s);
	color: black;
}
`;

export async function profile(username) {
	const [backgroundHTML, backgroundCSS] = initBackground();
	const loadHTML = `
	${backgroundHTML}
	${HTML}
	`;
	const loadCSS = `
	${backgroundCSS}
	${CSS}
	`;

	loadPage(loadHTML, loadCSS);
	eventBackground();

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
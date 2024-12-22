import { navigate } from "../app.js";
import { ChatAPI } from "../api/chat.js";
import { UserAPI } from "../api/user.js";
import { GameAPI } from "../api/game.js";
import { send_to_online_sock } from "../api/socket.js";
import { popupSystem } from "../services/popup.js";
import { i18n } from "../services/i18n.js";


function createProfilePreviewPopup(userData, userStats, userHistory) {
	return `
  <div id="profile-preview-overlay" class="profile-preview-overlay">
	<div class="profile-preview-container">
	  <button id="close-preview" class="close-preview-btn">
		<span class="material-icons">close</span>
	  </button>
	  <div class="profile-preview-content">
		<div class="profile-preview-grid">
		  <!-- Colonne de gauche: Historique des parties -->
		  <div class="game-history-section">
			<h3 class="game-history-header">${i18n.t("user.game_history")}</h3>
			<div class="game-history-list">
			  ${userHistory.length > 0 ? userHistory.map(game => `
				<div class="game-history-item">
				  <div class="game-players">
					<span class="${game.p1.username === userData.username ? 'player-self' : ''}">${game.p1.username}</span>
					<span class="vs">vs</span>
					<span class="${game.p2.username === userData.username ? 'player-self' : ''}">${game.p2.username}</span>
				  </div>
				  <div class="game-score">
					<span>${game.p1_score}</span>
					<span>-</span>
					<span>${game.p2_score}</span>
				  </div>
				  <div class="game-date">${new Date(game.time_end).toLocaleDateString()}</div>
				</div>
			  `).join('') : `<p>${i18n.t("user.no_games")}</p>`}
			</div>
		  </div>

		  <!-- Colonne de droite: Profil -->
		  <div class="profile-details-section">
			<div class="profile-preview-avatar">
			  <img src="/media${userData.pfp}" alt="${userData.username}" class="preview-avatar">
			</div>
			<h2 class="preview-username">${userData.username}</h2>
			<p class="preview-bio">${userData.bio}</p>

			<div class="preview-stats">
			  <div class="stat-item">
				<span class="stat-value">${userStats.games_played}</span>
				<span class="stat-label">${i18n.t("user.games_played")}</span>
			  </div>
			  <div class="stat-item">
				<span class="stat-value">${userStats.win_rate}%</span>
				<span class="stat-label">${i18n.t("user.win_rate")}</span>
			  </div>
			</div>

			<div class="profile-actions">
			  <button class="profile-action-btn message" title="${i18n.t("friends.send_message")}">
				<span class="material-icons">chat</span>
			  </button>
			  <button class="profile-action-btn play" title="${i18n.t("friends.invite_to_play")}">
				<span class="material-icons">sports_esports</span>
			  </button>
			  <button class="profile-action-btn block" title="${i18n.t("friends.block")}">
				<span class="material-icons">block</span>
			  </button>
			  <button class="profile-action-btn remove" title="${i18n.t("friends.remove")}">
				<span class="material-icons">delete</span>
			  </button>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </div>
  `;
}

async function handleActionButton(event) {
	const action = event.currentTarget.classList[1];
	const username = document.querySelector(".preview-username").textContent;

	switch (action) {
		case "message":
			await ChatAPI.startConversation(username);
			popupSystem("info", i18n.t("friends.message_sent") + " " + username);
			break;
		case "play":
			send_to_online_sock("fight " + username);
			popupSystem("info", `${i18n.t("notifications.fight.invite.send.pre")} ${username}`);
			return;
		case "block":
			await ChatAPI.blockUser(username);
			popupSystem("info", i18n.t("friends.block"));
			break;
		case "remove":
			await UserAPI.removeFriendRequest(username);
			popupSystem("info", i18n.t("friends.remove"));
			break;
		default:
			console.error("Unknown action:", action);
			break;
	}
	document.getElementById("profile-preview-overlay").remove();
	navigate("/friends");
}

export async function showProfilePreview(username) {
	try {
		// Fetch user profile and stats
		const userData = await UserAPI.getProfile(username);
		const userStats = await UserAPI.getUserStats(username);
		const userHistory = await GameAPI.getUserGameHistory(username);

		// Create and insert popup
		const popupHTML = createProfilePreviewPopup(userData, userStats, userHistory);
		document.body.insertAdjacentHTML("beforeend", popupHTML);

		// Close button
		document.getElementById("close-preview").addEventListener("click", () => {
			document.getElementById("profile-preview-overlay").remove();
		});

		// Close on outside click
		document
			.getElementById("profile-preview-overlay")
			.addEventListener("click", (e) => {
				if (e.target.id === "profile-preview-overlay") {
					e.target.remove();
				}
			});

		// Add event listeners for profile action buttons
		const actionButtons = document.querySelectorAll(".profile-action-btn");
		actionButtons.forEach((button) => {
			button.addEventListener("click", handleActionButton);
		});

		// si j'appuie sur echap je ferme la fenetre
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				document.getElementById("profile-preview-overlay").remove();
			}
		});										

	} catch (error) {
		console.error("Failed to load profile preview:", error);
		popupSystem("error", i18n.t("friends.profile_load_error"));
	}
}
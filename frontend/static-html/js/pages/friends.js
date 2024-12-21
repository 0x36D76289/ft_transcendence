import { UserAPI } from "../api/user.js";
import { ChatAPI } from "../api/chat.js";
import { GameAPI } from "../api/game.js";
import { popupSystem } from "../services/popup.js";
import { getUsername } from "../utils/cookies.js";
import { i18n } from "../services/i18n.js";
import { navigate } from "../app.js";
import { send_to_online_sock } from "../api/socket.js";

function createProfilePreviewPopup(userData, userStats, userHistory) {
  console.log(userHistory);

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
            <h3>${i18n.t("user.game_history")}</h3>
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

export function render() {
  return `
<section class="contacts-container">
	<header class="friends-header">
		<h1>${i18n.t("friends.title")}</h1>
	</header>

	<div class="search-container">
		<input type="text" id="searchInput" placeholder="${i18n.t("friends.search_user")}" class="search-input">
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
  const scrollBtn = document.getElementById("scrollTopBtn");
  const scrollThreshold = 300;

  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollThreshold) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
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

async function showProfilePreview(username) {
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
  } catch (error) {
    console.error("Failed to load profile preview:", error);
    popupSystem("error", i18n.t("friends.profile_load_error"));
  }
}

function renderContacts(friends) {
  const contactGrid = document.getElementById("contactGrid");
  contactGrid.innerHTML = friends
    .map(
      (friend) => {
        let actionButton;
        if (friend.status === "friend") {
          actionButton = `
            <button class="card-btn quick-play-btn" title="${i18n.t("friends.invite_to_play")}">
              <span class="material-icons">sports_esports</span>
            </button>`;
        } else if (friend.status === "request_received") {
          actionButton = `
              <button class="card-btn accept-friend-btn" title="${i18n.t("friends.accept_request")}">
                <span class="material-icons">person_add</span>
              </button>
              <button class="card-btn decline-friend-btn" title="${i18n.t("friends.decline_request")}">
                <span class="material-icons">person_add_disabled</span>
              </button>`;
        } else if (friend.status === "request_sent") {
          actionButton = `
            <button class="card-btn accept-friend-btn" title="${i18n.t("friends.cancel_request")}">
              <span class="material-icons">person_add_disabled</span>
            </button>`;
        }

        return `
          <div class="contact-card" data-user-id="${friend.user.username}">
            <img src="/media${friend.user.pfp}" alt="${friend.user.username}" class="contact-avatar">
            <h3 class="contact-username">${friend.user.username}</h3>
            <p class="contact-status" data-status="${friend.user.is_online ? "online" : "offline"}">
              ${friend.user.is_online ? i18n.t("friends.online") : i18n.t("friends.offline")}
            </p>
            ${actionButton}
          </div>`;
      }
    )
    .join("");

  // Add click handlers for the contact cards
  const contactCards = document.querySelectorAll(".contact-card");
  contactCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.closest('.quick-play-btn') && !e.target.closest('.add-friend-btn')) {
        const username = card.dataset.userId;
        showProfilePreview(username);
      }
    });

    const playBtn = card.querySelector('.quick-play-btn');
    if (playBtn) {
      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const username = card.dataset.userId;
        send_to_online_sock("fight " + username);
        popupSystem("info", i18n.t("friends.game_invite_sent") + " " + username);
      });
    }

    const acceptBtn = card.querySelector('.accept-friend-btn');
    if (acceptBtn) {
      acceptBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const username = card.dataset.userId;
        await UserAPI.sendFriendRequest(username);
        popupSystem("info", i18n.t("friends.friend_request_accepted"));
        refreshFriends();
      });
    }

    const declineBtn = card.querySelector('.decline-friend-btn');
    if (declineBtn) {
      declineBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const username = card.dataset.userId;
        await UserAPI.removeFriendRequest(username);
        popupSystem("info", i18n.t("friends.friend_request_declined"));
        refreshFriends();
      });
    }
  });
}

function refreshFriends() {
  const friends = UserAPI.getFriends(getUsername());
  renderContacts(friends);
}

export async function init() {
  const searchInput = document.getElementById("searchInput");
  const addFriendBtn = document.getElementById("addFriendBtn");

  let friends = await UserAPI.getFriends(getUsername());

  console.log(friends);

  searchInput.addEventListener("input", () => {
    const filterFriends = friends.filter((friend) =>
      friend.user.username.includes(searchInput.value),
    );
    renderContacts(filterFriends);
  });
  searchInput.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
      await UserAPI.sendFriendRequest(searchInput.value);
      popupSystem("info", i18n.t("friends.friend_request_sent"));
      refreshFriends();
    }
  });

  addFriendBtn.addEventListener("click", async () => {
    await UserAPI.sendFriendRequest(searchInput.value);
    popupSystem("info", i18n.t("friends.friend_request_sent"));
    refreshFriends();
  });

  renderContacts(friends);
  initScrollTopButton();
}

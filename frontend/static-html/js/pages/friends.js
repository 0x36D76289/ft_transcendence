import { UserAPI } from "../api/user.js";
import { popupSystem } from "../services/popup.js";
import { getUsername } from "../utils/cookies.js";
import { i18n } from "../services/i18n.js";
import { showProfilePreview } from "../components/profilepopup.js";
import { send_to_online_sock } from "../api/socket.js";

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

async function refreshFriends() {
  const friends = await UserAPI.getFriends(getUsername());
  renderContacts(friends);
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

function renderContacts(friends) {
  const contactGrid = document.getElementById("contactGrid");
  contactGrid.innerHTML = friends
    .map((friend) => {
      let actionButtons = '';
      if (friend.status === "friend") {
        actionButtons = `
            <button class="card-btn quick-play-btn" title="${i18n.t("friends.invite_to_play")}">
              <span class="material-icons">sports_esports</span>
            </button>`;
      } else if (friend.status === "request_received") {
        actionButtons = `
              <button class="card-btn accept-friend-btn" title="${i18n.t("friends.accept_request")}">
                <span class="material-icons">person_add</span>
              </button>
              <button class="card-btn decline-friend-btn" title="${i18n.t("friends.decline_request")}">
                <span class="material-icons">person_add_disabled</span>
              </button>`;
      } else if (friend.status === "request_sent") {
        actionButtons = `
            <button class="card-btn decline-friend-btn" title="${i18n.t("friends.cancel_request")}">
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
            <div class="action-buttons">
              ${actionButtons}
            </div>
          </div>`;
    })
    .join("");
  // Add click handlers for the contact cards
  const contactCards = document.querySelectorAll(".contact-card");
  contactCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (
        !e.target.closest(".quick-play-btn") &&
        !e.target.closest(".add-friend-btn")
      ) {
        const username = card.dataset.userId;
        showProfilePreview(username);
      }
    });

    const playBtn = card.querySelector(".quick-play-btn");
    if (playBtn) {
      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const username = card.dataset.userId;
        send_to_online_sock("fight " + username);
        popupSystem(
          "info",
          i18n.t("friends.game_invite_sent.pre") +
          username +
          i18n.t("friends.game_invite_sent.post"),
        );
      });
    }

    const acceptBtn = card.querySelector(".accept-friend-btn");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const username = card.dataset.userId;
        await UserAPI.sendFriendRequest(username);
        popupSystem("info", i18n.t("friends.friend_request_accepted"));
        await refreshFriends();
      });
    }

    const declineBtn = card.querySelector(".decline-friend-btn");
    if (declineBtn) {
      declineBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const username = card.dataset.userId;
        await UserAPI.removeFriendRequest(username);
        popupSystem("info", i18n.t("friends.friend_request_declined"));
        await refreshFriends();
      });
    }
  });
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
      await refreshFriends();
    }
  });

  addFriendBtn.addEventListener("click", async () => {
    await UserAPI.sendFriendRequest(searchInput.value);
    popupSystem("info", i18n.t("friends.friend_request_sent"));
    await refreshFriends();
  });

  renderContacts(friends);
  initScrollTopButton();
}

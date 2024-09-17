import { navigate } from "../spa.js";
import { getUserProfile } from "../api.js";
import { logMessage } from "../logs.js";

function renderHTML(username) {
  return `
<button class="play-button">Play</button>
<button class="logout-button">Logout</button>
${username ? `<div class="username-display">${username}</div>` : ""}
  `;
}

function renderCSS() {
  return `
.play-button {
  font-size: 60px;
  padding: 2rem 4rem;
  background-color: transparent;
  color: var(--text-color);
  border: none;
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: block;
  transition: transform 0.2s;
}

.play-button:hover {
  background-color: transparent;
  transform: translate(-50%, -50%) scale(1.3);
}

.logout-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.username-display {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: var(--small-font-size);
  color: var(--text-color);
}
  `;
}

export async function renderHome() {
  const app = document.getElementById("app");

  let username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  if (username && token) {
    try {
      const userProfile = await getUserProfile(username, token);
      username = userProfile.username; // In case it has changed
    } catch (error) {
      logMessage(`Failed to fetch user profile: ${error.message}`, "error");

      // If there's an error (e.g., token expired), we'll clear the stored credentials
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      username = null;
    }
  }

  app.innerHTML = renderHTML(username);

  const style = document.createElement("style");
  style.innerHTML = renderCSS();
  document.head.appendChild(style);

  document.querySelector(".play-button").addEventListener("click", () => {
    if (username) {
      navigate("/play");
    } else {
      logMessage("User must be logged in to play", "info");
      navigate("/account");
    }
  });

  document.querySelector(".logout-button").addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  });
}

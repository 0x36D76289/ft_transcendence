import { navigate } from "../spa.js";
import { getUserProfile } from "../api.js";
import { logMessage } from "../logs.js";

function renderHTML(username) {
  return `
    <button class="play-button">Play</button>
    <button class="account-button">Account</button>
    ${username ? `<div class="username-display">${username}</div>` : ""}
  `;
}

function renderCSS() {
  return `
    .play-button {
      font-size: var(--large-font-size);
      padding: 2rem 4rem;
      background-color: transparent;
      color: var(--text-color);
      border: none;
      cursor: pointer;
      position: absolute;
      left: 45%;
      top: 45%;
      display: block;
      transition: transform 0.3s ease-in-out;
    }
    .play-button:hover {
      transform: scale(1.5);
    }
    .account-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: var(--small-font-size);
      padding: 0.5rem 1rem;
      background-color: #333;
      color: var(--text-color);
      border: none;
      cursor: pointer;
    }
    .account-button:hover {
      background-color: #555;
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
      username = userProfile.username; // Use the username from the profile in case it has changed
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

  document.querySelector(".account-button").addEventListener("click", () => {
    navigate("/account");
  });

  document.querySelector(".play-button").addEventListener("click", () => {
    if (username) {
      navigate("/play");
    } else {
      logMessage("User must be logged in to play", "info");
      navigate("/account");
    }
  });
}

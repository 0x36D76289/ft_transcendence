import { navigate } from "../spa.js";
import { getUserProfile } from "../api.js";
import { logMessage } from "../logs.js";
import { createButton } from "../components/button.js";

function renderHTML(username) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const playButton = createButton("play-button", "Play", () => {
    if (username) {
      navigate("/play");
    } else {
      logMessage("User must be logged in to play", "info");
      navigate("/account");
    }
  });

  app.appendChild(playButton);

  if (username) {
    const logoutButton = createButton("logout-button", "Logout", () => {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      navigate("/");
    });

    const usernameDisplay = createButton("username-display", `Welcome, ${username}`, () => {
      navigate("/account");
    });

    app.appendChild(logoutButton);
    app.appendChild(usernameDisplay);
  }
}

function renderCSS() {
  const style = document.createElement("style");
  style.textContent = `
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
      font-size: var(--font-size);
      color: var(--text-color);
      background-color: transparent;
    }
  `;
  document.head.appendChild(style);
}

export async function renderHome() {
  let username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  renderCSS();
  renderHTML(username);
}

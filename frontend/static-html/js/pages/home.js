import { navigate } from "../spa.js";
import { logMessage } from "../logs.js";
import { createButton } from "../components.js";
import { getUserProfile } from "../api/user.js";

const CSS = `
.play-button {
  background-color: transparent;
  font-size: 5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease, font-size 0.3s ease;
}

.play-button:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1);
  transform: translate(-50%, -50%) scale(1.3);
}

.play-button:active {
  transform: translate(-50%, -50%) scale(1.1);
}

.username-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
`

export async function renderHome() {
  if (localStorage.getItem("authToken")) {
    try {
      const accountButton = createButton(localStorage.getItem("username"), async () => {
        logMessage("Account button clicked", "info");
        navigate("/account");
      }, "username-button");
    } catch (error) {
      logMessage("User is not logged in", "info");
    }
  }

  const playButton = createButton("▶", () => {
    logMessage("Play button clicked", "info");
    if (localStorage.getItem("authToken")) {
      navigate("/hub");
    } else {
      navigate("/connexion");
    }
  }, "play-button");
  document.body.appendChild(playButton);

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
}

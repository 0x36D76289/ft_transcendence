import { navigate } from "../spa.js";
import { createButton } from "../components.js";
import { getUserProfile } from "../api/user.js";
import { readCookie } from "../cookie.js";

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
  // load CSS
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const tokenValue = readCookie("authToken");
  console.log(tokenValue);

  let usernameButton = null;

  if (tokenValue) {
    const profile = await getUserProfile(tokenValue);
    usernameButton = createButton(profile.username, () => { navigate("/profile") }, "username-button");
  } else {
    usernameButton = createButton("Login", () => { navigate("/login") }, "username-button");
  }

  const playButton = createButton("▶️", () => { navigate("/game") }, "play-button");
  document.body.appendChild(playButton);
  document.body.appendChild(usernameButton);
}

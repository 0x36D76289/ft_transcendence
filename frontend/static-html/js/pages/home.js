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
  // load CSS
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  const tokenValue = readCookie("authToken");
  console.log(tokenValue);
  if (!tokenValue) {
    navigate("/account/login");
    return;
  }

  const profile = await getUserProfile(tokenValue);

  // add username button
  const usernameButton = createButton(profile.username, () => { navigate("/profile") }, "username-button");

  // add play button
  const playButton = createButton("▶️", () => { navigate("/game") }, "play-button");

}

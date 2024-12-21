import { send_to_online_sock } from "../api/socket.js";
import { navigate } from "../app.js";
import { i18n } from "../services/i18n.js";

/** @type {boolean} */
export var in_queue = false;

export function render() {
  return `
<div class="home-container">
	<button class="play-button">${i18n.t("home.play")}</button>
	<button class="play-button" id="queue-button">
		${in_queue ? i18n.t("notifications.matchmaking.leave") : i18n.t("notifications.matchmaking.join")}
	</button>
</div>
	`;
}

/** @returns {void} */
function renderButton() {
  let button = document.getElementById("queue-button");
  if (button === undefined) return;
  if (in_queue) button.innerHTML = i18n.t("notifications.matchmaking.leave");
  else button.innerHTML = i18n.t("notifications.matchmaking.join");
}

/**
 * @param {boolean} val - true for in queue
 * @returns {void}
 */
export function set_queue(val) {
  in_queue = val;
  if (window.location.pathname == "/" || window.location.pathname == "/pong") {
    renderButton();
  }
}

export function init() {
  const playButton = document.querySelector(".play-button");
  playButton.addEventListener("click", () => {
    navigate("/pong");
  });
  document.getElementById("queue-button").onclick = () => {
    send_to_online_sock("join_mm");
  };
  renderButton();
}

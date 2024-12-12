import { send_to_online_sock } from "../api/socket.js";
import { i18n } from "../services/i18n.js";
import { Participant, participants } from "./tournament/participants.js";

//@ts-check

/**
 * @param {Participant} participant - the participant to render
 * @returns {string}
 */
function renderParticipant(participant) {
  return ` <div class="participant ${participant.getHTMLClass()}">
			${participant.getName()}
			${participant.getRenderEmoji()}
			</div>
			`;
}

export function render() {
  return `
		<div class="tournament-container">
		<section class="current-tournament">
		<h2>${i18n.t("tournaments.current_tournament")}</h2>
		<div class="participant-list">
		${[...participants.iter()].map(renderParticipant).join("")}
		</div>
		</section>

		<section class="add-participant">
		<div class="input-group">
		<input type="text" id="username" placeholder="${i18n.t("tournaments.enter_username")}">
		<button class="add-button" id="add-user-button">+</button>
		</div>
		<div class="input-group">
		<input type="text" id="bot-name" placeholder="${i18n.t("tournaments.enter_bot_name")}">
		<button class="add-button" id="add-bot-button">+</button>
		</div>
		</section>

		<section class="start-tournament">
		<button class="start-button" id="start-button">${i18n.t("tournaments.start_tournament")}</button>
		</section>
		</div>
		`;
}

export function updateParticipantList() {
  const participantList = document.querySelector(".participant-list");
  if (participantList) {
    participantList.innerHTML = [...participants.iter()]
      .map(renderParticipant)
      .join("");
  }
}

export function init() {
  /** @type {HTMLTextAreaElement} */
  let username = document.getElementById("username");
  /** @type {HTMLButtonElement} */
  let userbutton = document.getElementById("add-user-button");
  userbutton.onclick = () => {
    if (username.value === "") return;
    participants.invite_player(username.value);
    username.value = "";
    updateParticipantList();
  };
  username.onkeyup = (event) => {
    if (event.key == "Enter") {
      userbutton.onclick();
    }
  };

  /** @type {HTMLTextAreaElement} */
  let botname = document.getElementById("bot-name");
  /** @type {HTMLButtonElement} */
  let botbutton = document.getElementById("add-bot-button");
  botbutton.onclick = () => {
    if (botname.value === "") return;
    participants.add_bot(botname.value);
    botname.value = "";
    updateParticipantList();
  };
  botname.onkeyup = (event) => {
    if (event.key == "Enter") {
      botbutton.onclick();
    }
  };

  /** @type {HTMLButtonElement} */
  let startbutton = document.getElementById("start-button");
  startbutton.onclick = () => {
    let userlist = participants.serialize();
    participants.empty();
    updateParticipantList();
    console.log("sending ", userlist);
    send_to_online_sock("start " + userlist);
  };
}

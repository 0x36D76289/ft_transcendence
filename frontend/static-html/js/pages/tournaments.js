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
		<button class="start-button">${i18n.t("tournaments.start_tournament")}</button>
		</section>
		</div>
		`;
}

export function updateParticipantList() {
  console.log("update: ", [...participants.iter()]);
  const participantList = document.querySelector(".participant-list");
  if (participantList) {
    participantList.innerHTML = [...participants.iter()]
      .map(renderParticipant)
      .join("");
  }
}

export function init() {
  //TODO: make it so pressing enter also calls the function

  /** @type {HTMLTextAreaElement} */
  let username = document.getElementById("username");
  function invite_player() {
    participants.invite_player(username.value);

    //TODO: send invite
    //add with event from socket
    //make invite reply send message
    //send who invited through the events and back when accepting invitation
    username.value = "";
    updateParticipantList();
  }
  document.getElementById("add-user-button").onclick = invite_player;
  username.onkeyup = (event) => {
    if (event.key == "Enter") {
      invite_player();
    }
  };

  /** @type {HTMLTextAreaElement} */
  let botname = document.getElementById("bot-name");
  document.getElementById("add-bot-button").onclick = () => {
    participants.add_bot(botname.value);
    botname.value = "";
    updateParticipantList();
  };

  participants.invite_player("Player1");
  participants.invite_player("Player1");
  participants.add_bot("Bot1");
  participants.invite_player("Player2");
  participants.add_bot("Bot2");
  participants.add_bot("Bot3");
  participants.invite_player("Player3");
  participants.add_bot("Bot4");
  participants.add_bot("Bot5");
  participants.invite_player("Player4");
  participants.set_status("Player1", true);
  participants.set_status("Player2", false);

  updateParticipantList();
}

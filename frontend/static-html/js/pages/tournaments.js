import { i18n } from "../services/i18n.js";

//@ts-check

/** class representing a participant in the list for the tournament page */
class Participant {
  /**
   * creates a participant
   * @param {string} name - the name of the participant
   * @param {boolean} bot - is the participant a bot
   */
  constructor(name, bot) {
    this.name = name;
    this.bot = bot;
    if (bot === true) this.accepted = true;
    this.accepted = null;
  }
}

/** @type {Participant[]} */
var participants = [];

export function render() {
  return `
		<div class="tournament-container">
		<section class="current-tournament">
		<h2>${i18n.t("tournaments.current_tournament")}</h2>
		<div class="participant-list">
		${participants
      .map(
        (participant) => `
			<div class="participant ${getParticipantClass(participant)}">
			${participant.name}
			${participant.accepted ? "✅" : participant.accepted === false ? "❌" : "⏳"}
			</div>
			`,
      )
      .join("")}
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

function getParticipantClass(participant) {
  if (participant.bot) return "participant-bot";
  if (participant.accepted === true) return "participant-accepted";
  if (participant.accepted === false) return "participant-rejected";
  return "participant-pending";
}

export function init() {
  function updateParticipantList() {
    const participantList = document.querySelector(".participant-list");
    if (participantList) {
      participantList.innerHTML = participants
        .map(
          (participant) => `
				<div class="participant ${getParticipantClass(participant)}">
				${participant.name}
				${
          participant.bot
            ? "🤖"
            : participant.accepted
              ? "✅"
              : participant.accepted === false
                ? "❌"
                : "⏳"
        }
				</div>
				`,
        )
        .join("");
    }
  }

  //TODO: make function for both that checks if name already in list before adding
  //TODO: make it so pressing enter also calls the function

  /** @type {HTMLTextAreaElement} */
  let username = document.getElementById("username");
  document.getElementById("add-user-button").onclick = () => {
    participants.push(new Participant(username.value, false));
    //TODO: send invite
    //add with event from socket
    //make invite reply send message
    //send who invited through the events and back when accepting invitation
    username.value = "";
    updateParticipantList();
  };
  /** @type {HTMLTextAreaElement} */
  let botname = document.getElementById("bot-name");
  document.getElementById("add-bot-button").onclick = () => {
    participants.push(new Participant(botname.value, true));
    botname.value = "";
    updateParticipantList();
  };

  participants.push(new Participant("Player1", false));
  participants.push(new Participant("Player1", false));
  participants.push(new Participant("Bot1", true));
  participants.push(new Participant("Player2", false));
  participants.push(new Participant("Bot2", true));
  participants.push(new Participant("Bot3", true));
  participants.push(new Participant("Player3", false));
  participants.push(new Participant("Bot4", true));
  participants.push(new Participant("Bot5", true));
  participants.push(new Participant("Player4", false));

  updateParticipantList();
}

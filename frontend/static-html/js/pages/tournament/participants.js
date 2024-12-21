import { send_to_online_sock } from "../../api/socket.js";
import { i18n } from "../../services/i18n.js";
import { popupSystem } from "../../services/popup.js";
import { updateParticipantList } from "../tournaments.js";

//@ts-check

export class Participant {
  /** @type {string} */
  #name;
  /** @type {boolean} */
  #bot;
  /** @type {?boolean} */
  #accepted;

  /**
   * creates a participant
   * @param {string} name - the name of the participant
   * @param {boolean} bot - is the participant a bot
   */
  constructor(name, bot) {
    this.#name = name;
    this.#bot = bot;
    this.#accepted = null;
    if (bot === true) this.#accepted = true;
  }

  /** @returns {string} */
  getName() {
    return this.#name;
  }
  /** @returns {boolean} */
  getBot() {
    return this.#bot;
  }
  /** @returns {?boolean} */
  getStatus() {
    return this.#accepted;
  }
  /** @returns {string} */
  getHTMLClass() {
    if (this.#bot) return "participant-bot";
    if (this.#accepted == true) return "participant-accepted";
    if (this.#accepted == false) return "participant-rejected";
    return "participant-pending";
  }
  /** @returns {string} */
  getRenderEmoji() {
    if (this.#bot) return "🤖";
    if (this.#accepted == true) return "✅";
    if (this.#accepted == false) return "❌";
    return "⏳";
  }
  /**
   * @param {boolean} status;
   * @returns {void}
   */
  setStatus(status) {
    this.#accepted = status;
  }
}

class TournamentParticipantsList {
  /** @type {Participant[]} */
  #list;

  constructor() {
    this.#list = [];
  }
  /**
   * @param {Participant} p
   * @returns {void}
   */
  #push(p) {
    this.#list.push(p);
  }

  /**
   * @param {string} name
   * @returns {void}
   */
  invite_player(name) {
    for (/** @type {Participant} */ const p of this.#list) {
      if (name === p.getName()) {
        popupSystem("error", `${i18n.t("notifications.tournament.already-in.pre")} ${name}`);
        return;
      }
    }
    this.#push(new Participant(name, false));
    send_to_online_sock("invite " + name);
  }
  /**
   * @param {string} name
   * @returns {void}
   */
  add_bot(name) {
    for (/** @type {Participant} */ const p of this.#list) {
      if (name === p.getName()) {
        popupSystem("error", `${i18n.t("notifications.tournament.already-in.pre")} ${name}`);
        return;
      }
    }
    this.#push(new Participant(name, true));
  }

  /**
   * @returns {Iterable<Participant>}
   */
  *iter() {
    yield* this.#list;
  }

  /**
   * @param {string} name
   * @param {boolean} status
   */
  set_status(name, status) {
    for (/** @type {Participant} */ const p of this.#list) {
      if (name === p.getName()) {
        p.setStatus(status);
        if (window.location.pathname == "/tournaments") updateParticipantList();
        return;
      }
    }
  }

  /** @returns {string} */
  serialize() {
    let ret = [];
    for (/** @type {Participant} */ const p of this.#list) {
      if (p.getStatus() === true) ret.push([p.getName(), p.getBot()]);
    }
    return JSON.stringify(ret);
  }

  /** @returns {void} */
  empty() {
    this.#list = [];
  }
}

/** @type {TournamentParticipantsList} */
export var participants = new TournamentParticipantsList();

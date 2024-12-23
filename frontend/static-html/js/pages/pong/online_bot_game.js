//@ts-check

import { getUsername } from "../../utils/cookies.js";
import { set_page_state, STATES } from "./globals.js";
import { local_update } from "./local_gameplay.js";
import { changenames } from "./render.js";
import {
  bots,
  init,
  interval,
  scores,
  start_simulation,
} from "./shared_gameplay.js";
import { game_sock } from "./socket.js";

/** @type {boolean} */
export var is_online_bot_game = false;

/** @type {number} */
var bot_game_start_time;

/** @returns {void} */
export function start_online_bot_game() {
  init();
  scores[0] = 0;
  scores[1] = 0;
  bots[0] = 0;
  bots[1] = 1;
  if (interval) clearInterval(interval);
  start_simulation(local_update);
  set_page_state(STATES.SP_Game);
  is_online_bot_game = true;
  bot_game_start_time = Date.now();
  changenames(getUsername(), "bot");
}

/** @returns {void} */
export function end_online_bot_game() {
  let obj = {
    p1: scores[0],
    p2: scores[1],
    start: bot_game_start_time,
    end: Date.now(),
  };
  if (scores[0] > scores[1]) {
    game_sock.send("win " + JSON.stringify(obj));
  } else {
    game_sock.send("lose " + JSON.stringify(obj));
  }
  is_online_bot_game = false;
}

//@ts-check

import {
  page_state,
  set_page_state,
  STATES,
  VIEW,
  VIEW_DIMENSIONS,
} from "./globals.js";
import { local_update } from "./local_gameplay.js";
import {
  bots,
  init,
  interval,
  scores,
  start_simulation,
  toggle_paused,
} from "./shared_gameplay.js";
import { name_entry_key, next_round } from "./tournament.js";

/** @type {Set} */
export const keys = new Set();

/**
 * @param {MouseEvent} param
 * @returns {void}
 */
export function canvas_click(param) {
  switch (page_state) {
    case STATES.SP_Game:
      toggle_paused();
      break;
    case STATES.MP_Game:
      break;
    case STATES.Tournament:
      break;
    case STATES.Menu:
      /** @type {number} */
      let clickx = param.clientX - VIEW.getBoundingClientRect().left;
      init();
      scores[0] = 0;
      scores[1] = 0;
      //P1 side
      if (clickx < VIEW_DIMENSIONS[0] / 2) {
        if (keys.has("Space")) {
          bots[0] = 1;
          bots[1] = 0;
        } else {
          bots[0] = 0;
          bots[1] = 1;
        }
        if (interval) clearInterval(interval);
        start_simulation(local_update);
        set_page_state(STATES.SP_Game);
      } else {
        if (keys.has("Space")) {
          bots[0] = 1;
          bots[1] = 1;
        } else {
          bots[0] = 0;
          bots[1] = 0;
        }
        if (interval) clearInterval(interval);
        start_simulation(local_update);
        set_page_state(STATES.SP_Game);
      }
      break;
    case STATES.Scores:
      next_round();
      break;
  }
}

/**
 * @param {KeyboardEvent} key_event
 * @returns {void}
 */
export function onkeydown(key_event) {
  keys.add(key_event.code);
  if (page_state != STATES.Name_Entry) return;
  name_entry_key(key_event);
}

/**
 * @param {KeyboardEvent} key_event
 * @returns {void}
 */
export function onkeyup(key_event) {
  keys.delete(key_event.code);
}

//@ts-check

import { page_state, STATES } from "./globals.js";
import { main_menu } from "./main_menu.js";
import { end_online_bot_game, is_online_bot_game } from "./online_bot_game.js";
import { interval } from "./shared_gameplay.js";
import { tournament_game_end } from "./tournament.js";

/**
 * @param {?string} winner
 * @returns {void}
 */
export function game_end_callback(winner) {
  if (interval) clearInterval(interval);
  switch (page_state) {
    case STATES.SP_Game:
      if (is_online_bot_game) end_online_bot_game();
    case STATES.MP_Game:
      main_menu();
      break;
    case STATES.Tournament:
      tournament_game_end(winner);
      break;
    case STATES.Menu:
      break;
    case STATES.Scores:
      break;
  }
}

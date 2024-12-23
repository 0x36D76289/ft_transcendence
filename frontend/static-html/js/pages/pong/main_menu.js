//@ts-check

import { set_page_state, STATES } from "./globals.js";
import { changenames, draw_main_menu } from "./render.js";

/** @returns {void} */
export function main_menu() {
  draw_main_menu();
  set_page_state(STATES.Menu);
  changenames();
}

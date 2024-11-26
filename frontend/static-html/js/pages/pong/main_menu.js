//@ts-check

import { set_page_state, STATES } from "./globals";
import { draw_main_menu } from "./render";

/**
	* @returns {void}
*/
export function main_menu() {
	draw_main_menu();
	set_page_state(STATES.Menu);
}

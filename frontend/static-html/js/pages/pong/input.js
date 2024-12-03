//@ts-check

import { online_sock } from "../../api/socket.js";
import { page_state, set_page_state, STATES, VIEW, VIEW_DIMENSIONS } from "./globals.js";
import { local_update } from "./local_gameplay.js";
import { bots, init, interval, scores, start_simulation } from "./shared_gameplay.js";
import { name_entry_key, next_round, start_name_entry } from "./tournament.js";

/** @type {Set} */
export const keys = new Set();

/**
	* @param {MouseEvent} param
	* @returns {void}
*/
export function canvas_click(param) {
	switch (page_state) {
		case STATES.SP_Game:
			//TODO: pause/unpause ?
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
				if (interval)
					clearInterval(interval);
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
				if (interval)
					clearInterval(interval);
				start_simulation(local_update);
				set_page_state(STATES.SP_Game);
			}
			break;
		case STATES.Scores:
			next_round();
			break;
	}
}

//TODO: make "init" function

//FIXME: TYPES 
//		+ RENAME
//		+ ADD KEYS.ADD IN HERE
//		+ ADD FUNCTION FOR KEYUP
//		+ ADD FUNCTION TO REMOVE LISTENERS AND REGISTER LISTENERS
export function name_enter(key_event) {
	//HACK: starting match with key, add real UI
	if (key_event.code == "KeyU") {
		console.log("STARTING ONLINE MATCH");
		online_sock.send("start");
	}
//	if (key_event.code == "KeyM") {
//		console.log("JOINING MM QUEUE");
//		online_sock.send("join_mm");
//	}
	if (key_event.code == "KeyL") {
		console.log("BOTGAME")
		online_sock.send("BOTGAME");
	}
	if (key_event.code == "Backquote") {
		start_name_entry();
	}
	if (page_state != STATES.Name_Entry)
		return;

	name_entry_key(key_event);
}

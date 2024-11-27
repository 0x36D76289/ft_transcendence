//@ts-check

import { page_state, set_page_state, STATES } from "./globals.js";
import { local_update } from "./local_gameplay.js";
import { main_menu } from "./main_menu.js";
import { render_name, render_rounds } from "./render.js";
import { bots, init, interval, scores, start_simulation } from "./shared_gameplay.js";

/** @type {Array<Array<string | null>>} */
let rounds = [];

/** @type {Array<string>} */
let players = [];

/** @type {number} */
let current_game = 0;

/** @type {number} */
let current_round = 0;


/** @type {Array<?string>} */
export const game_players = ["", ""]

/**
	* @param {number} n
	* @returns {number}
*/
function next_power_of_2(n) {
	let ret = 1;
	while (ret < n)
		ret <<= 1;
	return ret;
}

/**
	* @returns {void}
*/
function fill_rounds() {
	rounds.push([]);
	for (let i = 0; i < next_power_of_2(players.length); i++) {
		if (i < players.length) {
			rounds[0][i] = players[i];
		} else {
			rounds[0][i] = null;
		}
	}
	while (rounds[rounds.length - 1].length > 1) {
		rounds.push([]);
		for (let i = 0; i < rounds[rounds.length - 2].length / 2; i++) {
			rounds[rounds.length - 1].push(null);
		}
	}
}

/**
	* @returns {void}
*/
function start_tournament() {
	rounds = [];
	fill_rounds();
	current_game = 0;
	current_round = 0;
	set_page_state(STATES.Scores);
	render_rounds(rounds);
}

/**
	* @returns {void}
*/
export function start_name_entry() {
	set_page_state(STATES.Name_Entry);
	render_name(players);
}

/**
	* @returns {void}
*/
//FIXME: PARAM TYPE
//		 + EXCTRACT ISVALID
export function name_entry_key(key_event) {
	/**
		* @param {String} str
		* @returns {boolean}
	*/
	function isValid(str) {
		return str.length == 1 &&
			((str >= 'a' && str <= 'z') || 
				(str >= 'A' && str <= 'Z') ||
				(str >= "0" && str <= "9") ||
				str == "_" ||
				str == "-"
			);
	}
	console.log(key_event);
	//select index
	let index = players.length - 1;
	if (index == -1) index = 0;
	//grab string/create
	let string = players[index];
	if (string === undefined) string = "";
	//modify
	if (isValid(key_event.key))
		string += key_event.key;
	if (key_event.key == "Backspace")
		string = string.substring(0, string.length - 1);
	//save
	players[index] = string;
	//enter handling
	if (key_event.key == "Enter") {
		if (string == "") {
			if (players.length > 2) {
				players.pop();
				start_tournament();
				return;
			}
		} else {
			players[players.length] = "";
		}
	}
	//render
	render_name(players);
}

/**
	* @param {?string} p1 - player 1
	* @param {?string} p2 - player 2
	* @returns {void}
*/
function play_game(p1, p2) {
	set_page_state(STATES.Tournament);
	game_players[0] = p1;
	game_players[1] = p2;
	init();

	scores[0] = 0;
	scores[1] = 0;
	bots[0] = 0;
	bots[1] = 0;
	if (p1 === "bot")
		bots[0] = 1;
	if (p2 === "bot")
		bots[1] = 1;
	if (interval)
		clearInterval(interval);
	start_simulation(local_update);
}

/**
	* @returns {?string}
*/
export function next_round() {
	if (current_round >= rounds.length - 1) {
		main_menu();
		return rounds[rounds.length - 1][0];
	}
	//start game
	let p1 = rounds[current_round][current_game * 2];
	let p2 = rounds[current_round][current_game * 2 + 1];
	console.log("round " + current_round + " game " + current_game + ": " + p1 + " vs " + p2);
	if (p2 === null) {
		set_page_state(STATES.Tournament);
		game_end_callback(p1);
	} else {
		play_game(p1, p2);
	}
	return null;
}

//FIXME: OWN FILE
export function game_end_callback(winner) {
	if (interval)
		clearInterval(interval);
	switch (page_state) {
		case STATES.SP_Game:
		case STATES.MP_Game:
			main_menu();
			break;
		case STATES.Tournament:
			set_page_state(STATES.Scores);
			rounds[current_round + 1][current_game] = winner;
			current_game += 1;
			current_game %= rounds[current_round].length / 2;
			if (current_game == 0)
				current_round += 1;
			render_rounds(rounds);
			break;
		case STATES.Menu:
			break;
		case STATES.Scores:
			break;
	}
}

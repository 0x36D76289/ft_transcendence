//@ts-check

import { getToken } from "../../utils/cookies.js";
import { set_page_state, STATES } from "./globals.js";
import { main_menu } from "./main_menu.js";
import { multiplayer_init, multiplayer_update, player_num, set_player_num } from "./online_gameplay.js";
import { GAME_SETTINGS, inputs, interval, scores, start_simulation } from "./shared_gameplay.js";

/**
	* @param {string} room_name
	* @returns {string}
*/
function game_url(room_name) {
	return "wss://" +
	window.location.host +
	'/api/ws/pong/' +
	room_name +
	'/' +
	"?token=" +
	getToken();
}

/** @type {WebSocket} */
export var game_sock = new WebSocket(game_url("test"));

/** @type {WebSocket} */
//TODO: use the real socket and add read_room to it
const online_sock = new WebSocket(
	"wss://" +
	window.location.host +
	'/api/ws/user/online_status?token=' +
	getToken()
);
online_sock.onmessage = read_room;

/**
	* @param {Object} object
	* @returns {void}
*/
function read_room(object) {
	try {
		console.log("received ", object, " from online_sock");
		let inner = JSON.parse(object.data);
		if (inner.type == "game_start") {
			let room = inner.value;
			game_sock.close();
			game_sock = new WebSocket(game_url(room));
			game_sock.onmessage = game_sock_receive;
		}
	} catch (e) {
		console.log("[online_sock] couldn't parse: ", object.data);
		return;
	}
}

//TODO: wait for socket to connect ?
//TODO: error on enemy socket close ?

/**
	* @param {Object} object
	* @returns {void}
*/
function game_sock_receive(object) {
	try {
		let inner = JSON.parse(object.data);
		if (inner.type == "player_assign") {
			set_player_num(player_num);
			console.log("Assigned to player ", player_num);
			if (player_num == 1 || player_num == 2) {
				scores[0] = 0;
				scores[1] = 0;
				game_sock.send('{"type":"score","p1":0, "p2": 0}');
			}
		} else if (inner.type == "score") {
			console.log("received score update ", inner);
			set_page_state(STATES.MP_Game);
			scores[0] = inner.p1;
			scores[1] = inner.p2;
			if (interval)
				clearInterval(interval);
			if (scores[0] == GAME_SETTINGS.win_score || scores[1] == GAME_SETTINGS.win_score) {
				main_menu();
			} else {
				multiplayer_init();
				start_simulation(multiplayer_update);
			}
		} else if (inner.type == "input") {
			while (inner.frame >= inputs.length) {
				inputs[inputs.length] = [undefined, undefined];
			}
			inputs[inner.frame][inner.player - 1] = inner.input;
		}

	} catch (e) {
		console.log("[game sock] couldn't parse: ", object.data);
		return;
	}
}



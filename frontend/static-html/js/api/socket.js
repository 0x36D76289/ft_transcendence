import { navigate } from "../app.js";
import { read_room } from "../pages/pong/socket.js"
import { popupSystem } from "../services/popup.js";
import { getToken } from "../utils/cookies.js";

//@ts-check

/** @type {WebSocket} */
export var online_sock;

/** @returns {void} */
export function create_socket() {
	online_sock = new WebSocket(
		"wss://" +
		window.location.host +
		'/api/ws/user/online_status?token=' +
		getToken()
	);
	online_sock.onmessage = read_sock;
	console.log("socket created");
	console.log(online_sock);
}

/**
	* @param {MessageEvent} object
	* @returns {void}
*/
function read_sock(object) {
	console.log("received ", object)
	let inner;
	try {
		inner = JSON.parse(object.data);
	} catch (e) {
		console.log("[online_sock] couldn't parse: ", object.data);
		return;
	}
	switch (inner.type) {
		case "game_start":
			if (window.location.pathname == "/pong") {
				read_room(inner);
			} else {
				navigate("/pong", { game: inner})
			}
			break;
		//TODO: ADD i18n
		case "notify":
			popupSystem("info", inner.value);
			break;
		case "notify-success":
			popupSystem("success", inner.value);
			break;
		case "notify-error":
			popupSystem("error", inner.value);
			break;
		case "game-invite":
			popupSystem("warning", inner.value + " wants to play with you", true,
			() => {online_sock.send("fight " + inner.value)})
			break;
		default:
			console.log("couldn't recognize type: ", inner.type)
	}
}

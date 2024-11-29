import { navigate } from "../app.js";
import { read_room } from "../pages/pong/socket.js"
import { getToken } from "../utils/cookies.js";

//@ts-check

/** @type {WebSocket} */
export var online_sock;

export function create_socket() {
	online_sock = new WebSocket(
		"wss://" +
		window.location.host +
		'/api/ws/user/online_status?token=' +
		getToken()
	);
	online_sock.onmessage = read_sock;
	console.log("socket created");
	console.log(online_sock.readyState);
}

function read_sock(object) {
	try {
		let inner = JSON.parse(object.data);
		if (inner.type == "game_start") {
			if (window.location.pathname == "/pong") {
				read_room(inner);
			} else {
				navigate("/pong", { game: inner})
			}
		}
	} catch (e) {
		console.log("[online_sock] couldn't parse: ", object.data);
		return;
	}
}

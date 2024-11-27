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
	online_sock.onmessage = read_room;
}

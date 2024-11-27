//@ts-check

import { online_sock } from "../../api/socket.js";

export function render() {
	return `
		<div class="hflex">
			<canvas class="game" id="game" width="600px" height="450px">you're not supposed to see this</canvas>
			<div class="vflex">
				<button type="button" class="pong_nav_button" id="matchmaking">Join Matchmaking</button>
				<div class="spacer"></div>
				<button type="button" class="pong_nav_button">Join Tournament?</button>
			</div>
		</div>
	`;
}

export async function init() {
	const { name_enter, canvas_click, keys } = await import("./input.js");
	const { main_menu } = await import("./main_menu.js");
	const { init_globals, VIEW } = await import("./globals.js");

	init_globals();
//TODO: save event listeners so you can close them later
	document.getElementById("matchmaking").onclick = function () { online_sock.send("join_mm"); }
	window.addEventListener('keydown', function (e) { keys.add(e.code); name_enter(e); })
	window.addEventListener('keyup', function (e) { keys.delete(e.code); })
	window.addEventListener('resize', init_globals);

	
	
	main_menu();
}

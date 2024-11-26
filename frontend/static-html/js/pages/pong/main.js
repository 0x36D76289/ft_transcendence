//@ts-check

export function render() {
	return `
		<canvas class="game" id="game" width="600" height="450">you're not supposed to see this</canvas>
	`;
}

export async function init() {
	const { name_enter } = await import("./input.js");
	const { main_menu } = await import("./main_menu.js");

	function initPong() {
		VIEW.onclick = canvas_click;
	//TODO: save event listeners so you can close them later
		window.addEventListener('keydown', function (e) { keys.add(e.code); name_enter(e); })
		window.addEventListener('keyup', function (e) { keys.delete(e.code); })
	}

	
	
	initPong();
	main_menu();
}

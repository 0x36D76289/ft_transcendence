import { min } from "../../utils/math.js"
import { canvas_click } from "./input.js";
import { vec2 } from "./types.js";

//@ts-check


/** @type {vec2} */
export const GAME_DIMENSIONS = new vec2(400, 300);

/** @type {HTMLCanvasElement} */
var VIEW;

/** @type {vec2} */
export var VIEW_DIMENSIONS;

/** @type {HTMLCanvasElement} */
var BUFF;

/** @type {CanvasRenderingContext2D} */
export var ctx;

/** @type {CanvasRenderingContext2D} */
var buff_ctx;

export function init_globals() {
	while (VIEW == undefined) {
		VIEW = document.getElementById("game");
	}
	VIEW.onclick = canvas_click;
	console.log("VIEW IS ", VIEW);

	VIEW_DIMENSIONS = new vec2(VIEW.width, VIEW.height);

	BUFF = document.createElement("canvas");
	BUFF.width = VIEW_DIMENSIONS[0];
	BUFF.height = VIEW_DIMENSIONS[1];

	ctx = VIEW.getContext("2d", { alpha: false });

	buff_ctx = BUFF.getContext("2d", { alpha: false });
	buff_ctx.fillStyle = "white";
	buff_ctx.textAlign = "center";
	buff_ctx.textBaseline = "middle";
	buff_ctx.font = (min(VIEW_DIMENSIONS[0] / 12, VIEW_DIMENSIONS[1] / 9) | 0) + "px Arial";
}

export const STATES = {
	SP_Game: Symbol('sp_game'),
	MP_Game: Symbol('mp_game'),
	Tournament: Symbol('tournament'),
	Menu: Symbol('menu'),
	Scores: Symbol('scores'),
	Name_Entry: Symbol('name_entry'),
}

/** @type {Symbol} */
export var page_state = STATES.Menu;

/**
	* @param {Symbol} state - the state to be set, pulled from the STATE object
	* @returns {void}
*/
export function set_page_state(state) {
	page_state = state;
}

export { VIEW, BUFF, buff_ctx }

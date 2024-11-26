//@ts-check

import { BUFF, buff_ctx, ctx, GAME_DIMENSIONS, VIEW_DIMENSIONS } from "./globals";
import { GAME_SETTINGS } from "./shared_gameplay";
import { vec2 } from "./types";

/**
	* @param {number} x1 - the left x coordinate of the rectangle
	* @param {number} y1 - the top y coordinate of the rectangle
	* @param {number} x2 - the right x coordinate of the rectangle
	* @param {number} y2 - the bottom y coordinate of the rectangle
	* @returns {void}
*/
function draw_rect(x1, y1, x2, y2) {
	buff_ctx.fillRect(
		x1 * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
		y1 * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1],
		(x2 - x1) * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
		(y2 - y1) * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1]
	);
}

/**
	* @param {number} x1 - the left x coordinate of the rectangle
	* @param {number} y1 - the top y coordinate of the rectangle
	* @param {number} x2 - the right x coordinate of the rectangle
	* @param {number} y2 - the bottom y coordinate of the rectangle
	* @returns {void}
*/
function reset_rect(x1, y1, x2, y2) {
	buff_ctx.clearRect(
		x1 * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
		y1 * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1],
		(x2 - x1) * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
		(y2 - y1) * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1]
	);
}

/**
	* @returns {void}
*/
function reset() {
	buff_ctx.clearRect(0, 0, VIEW_DIMENSIONS[0], VIEW_DIMENSIONS[1]);
}

/**
	* @param {import("./types").GameState} state - the state to draw
	* @param {vec2} scores
	* @returns {void}
*/
export function draw(state, scores) {
	reset();
	//draw text
	{
		buff_ctx.fillText(scores[0] + " - " + scores[1], (VIEW_DIMENSIONS[0] / 2) | 0, (VIEW_DIMENSIONS[1] / 3) | 0);
		if (state.countdown_frames > 0)
			buff_ctx.fillText("" + ((state.countdown_frames + 59) / 60 | 0), (VIEW_DIMENSIONS[0] / 2) | 0, (VIEW_DIMENSIONS[1] * 2 / 3) | 0);
	}
	//draw ball
	{
		let outline_width = 1;
		reset_rect(
			state.ball_x - GAME_SETTINGS.ball_size - outline_width,
			state.ball_y - GAME_SETTINGS.ball_size - outline_width,
			state.ball_x + GAME_SETTINGS.ball_size + outline_width,
			state.ball_y + GAME_SETTINGS.ball_size + outline_width
		);
		draw_rect(
			state.ball_x - GAME_SETTINGS.ball_size,
			state.ball_y - GAME_SETTINGS.ball_size,
			state.ball_x + GAME_SETTINGS.ball_size,
			state.ball_y + GAME_SETTINGS.ball_size
		);
	}
	//draw paddles
	{
		draw_rect(
			0,
			state.p1_height - GAME_SETTINGS.paddle_height,
			GAME_SETTINGS.paddle_width,
			state.p1_height + GAME_SETTINGS.paddle_height
		);
		draw_rect(
			GAME_DIMENSIONS[0] - GAME_SETTINGS.paddle_width,
			state.p2_height - GAME_SETTINGS.paddle_height,
			GAME_DIMENSIONS[0],
			state.p2_height + GAME_SETTINGS.paddle_height
		);
	}
	//copy buffer
	ctx.drawImage(BUFF, 0, 0);
}

/**
	* @param {string[]} players
	* @returns {void}
*/
export function render_name(players) {
	let index = players.length - 1;
	if (index == -1) index = 0;
	let string = players[index];
	if (string === undefined) string = "";
	reset();
	if (string == "") {
		buff_ctx.fillText("Press enter to begin", VIEW_DIMENSIONS[0] / 2, VIEW_DIMENSIONS[1] / 3);
		buff_ctx.fillText("or type a name", VIEW_DIMENSIONS[0] / 2, VIEW_DIMENSIONS[1] * 2 / 3);
	} else {
		buff_ctx.fillText(string, VIEW_DIMENSIONS[0] / 2, VIEW_DIMENSIONS[1] / 2);
	}
	ctx.drawImage(BUFF, 0, 0);
}

/**
	* @param {Array<Array<string | null>>} rounds
	* @returns {void}
*/
export function render_rounds(rounds) {
	reset();
	let round;
	for (let i = 0; i < rounds.length; i++) {
		round = rounds[i];
		for (let j = 0; j < round.length; j++) {
			let content = round[j];
			if (content === null)
				content = "ø";
			buff_ctx.fillText(content, VIEW_DIMENSIONS[0] * (i + 1) / (rounds.length + 1), VIEW_DIMENSIONS[1] * (j + 1) / (round.length + 1));
		}
	}
	ctx.drawImage(BUFF, 0, 0);
}

/**
	* @returns {void}
*/
export function draw_main_menu() {
	let half_x = (GAME_DIMENSIONS[0] / 2) | 0;
	let quarter_x = (VIEW_DIMENSIONS[0] / 4) | 0;
	let half_y = (VIEW_DIMENSIONS[1] / 2) | 0;
	let line_width = 8;

	reset();
	draw_rect(half_x - line_width, 0, half_x + line_width, GAME_DIMENSIONS[1]);
	buff_ctx.fillText("1P Game", quarter_x, half_y);
	buff_ctx.fillText("2P Game", quarter_x * 3, half_y);
	ctx.drawImage(BUFF, 0, 0);
}

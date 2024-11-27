//@ts-check

/**
 * @typedef {import("./types").GameState} GameState
 */

/**
	* @param {GameState} src
	* @param {GameState} dest
	* @returns {void}
*/
function copy_gamestate(src, dest) {
	dest.frame = src.frame;
	dest.ball_x = src.ball_x;
	dest.ball_y = src.ball_y;
	dest.p1_height = src.p1_height;
	dest.p2_height = src.p2_height;
	dest.ball_speed_x = src.ball_speed_x;
	dest.ball_speed_y = src.ball_speed_y;
	dest.countdown_frames = src.countdown_frames;
}

export { copy_gamestate }

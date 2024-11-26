//@ts-check

/**
	* @module pong_types
*/

/** Vector2 type, contains 2 numbers that can be accessed as 0, 1 or x, y */
export class vec2 {
	/**
		* @param {number} x
		* @param {number} y
	*/
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
		* @returns {number}
	*/
	get 0() {
		return this.x;
	}

	/**
		* @returns {number}
	*/
	get 1() {
		return this.y;
	}

	/**
		* @param {number} value
	*/
	set 0(value) {
		this.x = value;
	}

	/**
		* @param {number} value
	*/
	set 1(value) {
		this.y = value;
	}
}

/**
	* @typedef {Object} GameState - creates a new type named 'SpecialType'
	* @property {number} frame - the frame number of the round, counts up
	* @property {number} ball_x - x position of the center of the ball
	* @property {number} ball_y - y position of the center of the ball
	* @property {number} p1_height - y position of the center of p1 paddle
	* @property {number} p2_height - y position of the center of p2 paddle
	* @property {number} ball_speed_x - the x speed of the ball
	* @property {number} ball_speed_y - the y speed of the ball
	* @property {number} countdown_frames - how many frames before round start
	*/

/**
	* @typedef { -1 | 0 | 1 } input
*/

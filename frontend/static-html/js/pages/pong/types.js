/**
 * @module pong_types
 */

//@ts-check

/**
 * @typedef {Object} GameState - creates a new type named 'GameState'
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
 * @typedef {Object} PongMessage - the type of message sent for inputs
 * @property {"input"} type - the message type
 * @property {number} frame - the frame number
 * @property {1 | 2} player - the player_num
 * @property {input} input - the input of the player
 * @property {number} frame_advantage - how far ahead you are
 */

/**
 * @typedef { -1 | 0 | 1 } input
 */

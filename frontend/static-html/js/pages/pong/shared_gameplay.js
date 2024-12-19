import { vec2 } from "./types.js";
import { GAME_DIMENSIONS } from "./globals.js";

//@ts-check

/**
 * @typedef {import("./types").GameState} GameState
 * @typedef {import("./types").input} input
 */

/** @type {GameState} */
export const current_state = {
  frame: 0,
  ball_x: 0,
  ball_y: 0,
  p1_height: 0,
  p2_height: 0,
  ball_speed_x: 0,
  ball_speed_y: 0,
  countdown_frames: 0,
};

export const GAME_SETTINGS = {
  paddle_width: 5,
  paddle_height: 20,
  paddle_speed: 4,
  ball_size: 3,
  ball_speed: 5,
  ball_y_speed_factor: 3,
  win_score: 10,
  countdown_length: 180,
};

/** @type {?ReturnType<typeof setInterval>} */
export var interval = null;

/** @type {boolean} */
export var game_paused = false;

/** @returns {void} */
export function toggle_paused() {
  game_paused = !game_paused;
}

/**
 * @param {Function(): void} func
 * @returns {void}
 */
export function start_simulation(func) {
  game_paused = false;
  interval = setInterval(func, 1000 / 60); // 60 fps
}

/** @type {Array<input | undefined>[]} */
export var inputs = [];

/** @type {vec2} */
export const bots = new vec2(0, 0);

/** @type {vec2} */
export var scores = new vec2(0, 0);

/**
 * sets all the values for the start of the round
 * @returns {void}
 */
export function init() {
  inputs = [[0, 0]];
  current_state.frame = 0;
  current_state.ball_x = (GAME_DIMENSIONS[0] / 2) | 0;
  current_state.ball_y = (GAME_DIMENSIONS[1] / 2) | 0;
  current_state.p1_height = current_state.ball_y;
  current_state.p2_height = current_state.ball_y;
  current_state.ball_speed_y = -GAME_SETTINGS.ball_speed;
  current_state.ball_speed_x = GAME_SETTINGS.ball_speed;
  current_state.countdown_frames = GAME_SETTINGS.countdown_length;
  if (scores[0] <= scores[1]) {
    current_state.ball_speed_x *= -1;
  }
}

/**
 * returns the position pos such that it doesn't reach outside min/max
 * @param {number} pos
 * @param {number} size
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function bound(pos, size, min, max) {
  if (pos - size < min) return min + size;
  if (pos + size > max) return max - size;
  return pos;
}

/**
 * @param {GameState} state
 * @param {vec2} input
 * @returns {void}
 * INFO: MODIFIES STATE
 */
export function tick_move_paddle(state, input) {
  state.p1_height += input[0] * GAME_SETTINGS.paddle_speed;
  state.p2_height += input[1] * GAME_SETTINGS.paddle_speed;
  state.p1_height = bound(
    state.p1_height,
    GAME_SETTINGS.paddle_height,
    0,
    GAME_DIMENSIONS[1],
  );
  state.p2_height = bound(
    state.p2_height,
    GAME_SETTINGS.paddle_height,
    0,
    GAME_DIMENSIONS[1],
  );
}

/**
 * @param {GameState} state
 * @param {vec2} input
 * @returns {void}
 * INFO: MODIFIES STATE
 */
export function tick_move_ball(state, input) {
  if (state.countdown_frames > 0) {
    state.countdown_frames -= 1;
  } else {
    state.ball_x += state.ball_speed_x;
    state.ball_y += state.ball_speed_y;
    state.ball_x = bound(
      state.ball_x,
      GAME_SETTINGS.ball_size,
      0,
      GAME_DIMENSIONS[0],
    );
    state.ball_y = bound(
      state.ball_y,
      GAME_SETTINGS.ball_size,
      0,
      GAME_DIMENSIONS[1],
    );
  }
}

/**
 * @param {GameState} state
 * @param {vec2} input
 * @returns {void}
 * INFO: MODIFIES STATE
 */
export function tick_bounce_vertical(state, input) {
  if (
    state.ball_y == GAME_SETTINGS.ball_size ||
    state.ball_y == GAME_DIMENSIONS[1] - GAME_SETTINGS.ball_size
  )
    state.ball_speed_y *= -1;
}

/**
 * @param {number} ball_y
 * @param {number} paddle_y
 * @returns {number}
 */
export function ball_bounce_y_speed(ball_y, paddle_y) {
  return ((ball_y - paddle_y) / GAME_SETTINGS.ball_y_speed_factor) | 0;
}

/**
 * @param {GameState} state
 * @param {number} playernum
 * @returns {void}
 * INFO: MODIFIES STATE
 */
function bounce_ball(state, playernum) {
  state.ball_speed_x *= -1;
  if (playernum == 1)
    state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p1_height);
  else if (playernum == 2)
    state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p2_height);
}

/**
 * @param {number} ball_y
 * @param {number} paddle_y
 * @returns {boolean}
 */
function is_ball_in_paddle_y_range(ball_y, paddle_y) {
  return (
    ball_y - GAME_SETTINGS.ball_size < paddle_y + GAME_SETTINGS.paddle_height &&
    ball_y + GAME_SETTINGS.ball_size > paddle_y - GAME_SETTINGS.paddle_height
  );
}

/**
 * @param {GameState} state
 * @param {vec2} input
 * @returns {void}
 * INFO: MODIFIES STATE
 */
export function tick_bounce_horizontal(state, input) {
  if (
    state.ball_speed_x < 0 &&
    state.ball_x - GAME_SETTINGS.ball_size < GAME_SETTINGS.paddle_width &&
    is_ball_in_paddle_y_range(state.ball_y, state.p1_height)
  )
    bounce_ball(state, 1);
  else if (
    state.ball_speed_x > 0 &&
    state.ball_x + GAME_SETTINGS.ball_size >
      GAME_DIMENSIONS[0] - GAME_SETTINGS.paddle_width &&
    is_ball_in_paddle_y_range(state.ball_y, state.p2_height)
  )
    bounce_ball(state, 2);
}

/**
 * @param {GameState} state
 * @returns {boolean}
 */
function is_ball_on_left(state) {
  return state.ball_x == GAME_SETTINGS.ball_size;
}

/**
 * @param {GameState} state
 * @returns {boolean}
 */
function is_ball_on_right(state) {
  return state.ball_x == GAME_DIMENSIONS[0] - GAME_SETTINGS.ball_size;
}

/**
 * @param {GameState} state
 * @returns {number} - which player died, 0 if none
 */
export function detect_death(state) {
  if (state.ball_speed_x < 0 && is_ball_on_left(state)) return 1;
  if (state.ball_speed_x > 0 && is_ball_on_right(state)) return 2;
  return 0;
}

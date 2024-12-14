//@ts-check

import { GAME_DIMENSIONS } from "./globals.js";
import { keys } from "./input.js";
import { draw } from "./render.js";
import {
  bots,
  current_state,
  detect_death,
  GAME_SETTINGS,
  init,
  inputs,
  scores,
  tick_bounce_horizontal,
  tick_bounce_vertical,
  tick_move_ball,
  tick_move_paddle,
} from "./shared_gameplay.js";
import { vec2 } from "./types.js";
import { game_end_callback, game_players } from "./tournament.js";

/**
 * @typedef {import("./types").GameState} GameState
 * @typedef {import("./types").input} input
 */

// /**
// 	* @param {GameState} state
// 	* @param {vec2} input
// 	* @returns {void}
// 	* INFO: MODIFIES STATE
// */
// function local_bounce_horizontal(state, input) {
// 	if (!is_ball_on_wall(state)) {
// 		return;
// 	}
// 	state.ball_speed_x *= -1;
// 	if (is_ball_on_left(state)) {
// 		if (!is_ball_bouncing(state.ball_y, state.p1_height)) {
// 			scores[1] += 1;
// 			init();
// 		} else {
// 			state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p1_height);
// 		}
// 	} else {
// 		if (!is_ball_bouncing(state.ball_y, state.p2_height)) {
// 			scores[0] += 1;
// 			init();
// 		} else {
// 			state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p2_height);
// 		}
// 	}
// }

/**
 * @param {number} p_y - the height of the bot's paddle
 * @param {number} ball_y
 * @param {number} ball_x
 * @returns {input}
 */
function bot_sim(p_y, ball_y, ball_x) {
  if (ball_x < GAME_SETTINGS.ball_speed * 2) {
    if (p_y < ball_y) {
      p_y += ((GAME_SETTINGS.paddle_height * 2) / 3) | 0;
    } else {
      p_y -= ((GAME_SETTINGS.paddle_height * 2) / 3) | 0;
    }
  }
  if (p_y < ball_y) {
    return 1;
  }
  if (p_y > ball_y) {
    return -1;
  }
  return 0;
}

/**
 * @param {GameState} state
 * @returns {void}
 * INFO: MODIFIES STATE
 */
function tick_local_death_processing(state) {
  /** @type {number} */
  let death = detect_death(state);

  if (death) {
    scores[death % 2] += 1;
    init();
  }
}

/** @returns {void} */
export function local_update() {
  inputs[0][0] = 0;
  if (bots[0]) {
    inputs[0][0] = bot_sim(
      current_state.p1_height,
      current_state.ball_y,
      current_state.ball_x,
    );
  } else {
    if (keys.has("KeyW")) {
      inputs[0][0] = -1;
    } else if (keys.has("KeyS")) {
      inputs[0][0] = 1;
    }
    if (bots[1]) {
      if (keys.has("ArrowUp")) {
        inputs[0][0] = -1;
      } else if (keys.has("ArrowDown")) {
        inputs[0][0] = 1;
      }
    }
  }
  inputs[0][1] = 0;
  if (bots[1]) {
    inputs[0][1] = bot_sim(
      current_state.p2_height,
      current_state.ball_y,
      GAME_DIMENSIONS[0] - current_state.ball_x,
    );
  } else {
    if (keys.has("ArrowUp")) {
      inputs[0][1] = -1;
    } else if (keys.has("ArrowDown")) {
      inputs[0][1] = 1;
    }
    if (bots[0]) {
      if (keys.has("KeyW")) {
        inputs[0][1] = -1;
      } else if (keys.has("KeyS")) {
        inputs[0][1] = 1;
      }
    }
  }
  tick_move_paddle(current_state, inputs[0]);
  tick_move_ball(current_state, inputs[0]);
  tick_bounce_vertical(current_state, inputs[0]);
  tick_bounce_horizontal(current_state, inputs[0]);
  tick_local_death_processing(current_state);
  draw(current_state, scores);
  if (scores[0] == GAME_SETTINGS.win_score) game_end_callback(game_players[0]);
  if (scores[1] == GAME_SETTINGS.win_score) game_end_callback(game_players[1]);
}

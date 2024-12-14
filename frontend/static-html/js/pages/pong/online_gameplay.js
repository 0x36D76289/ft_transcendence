//@ts-check

import { copy_gamestate } from "./gamestate.js";
import { keys } from "./input.js";
import { draw } from "./render.js";
import {
  current_state,
  detect_death,
  init,
  inputs,
  interval,
  scores,
  tick_bounce_horizontal,
  tick_bounce_vertical,
  tick_move_ball,
  tick_move_paddle,
} from "./shared_gameplay.js";
import { game_sock } from "./socket.js";
import { vec2 } from "./types.js";

/**
 * @typedef {import("./types").GameState} GameState
 * @typedef {import("./types").input} input
 */

/** @type {number} */
export var player_num = 0;

/**
 * @param {number} n
 * @returns {void}
 */
export function set_player_num(n) {
  player_num = n;
}

/** @type {number} */
var last_processed_frame = 0;

/** @type {number} */
var current_frame = 0;

/** @type {import("./types").GameState} */
var last_processed_state = Object.assign({}, current_state);

// /**
//  * @param {GameState} state
//  * @param {vec2} input
//  * @returns {void}
//  * INFO: MODIFIES STATE
//  */
// function multiplayer_tick_bounce_horizontal(state, input) {
//   if (!is_ball_on_wall(state)) {
//     return;
//   }
//   state.ball_speed_x *= -1;
//   if (is_ball_on_left(state)) {
//     if (player_num == 1 && !is_ball_bouncing(state.ball_y, state.p1_height)) {
//       scores[1] += 1;
//       game_sock.send(
//         JSON.stringify({
//           type: "score",
//           p1: scores[0],
//           p2: scores[1],
//         }),
//       );
//       if (interval) clearInterval(interval);
//     } else {
//       state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p1_height);
//     }
//   } else {
//     if (player_num == 2 && !is_ball_bouncing(state.ball_y, state.p2_height)) {
//       scores[0] += 1;
//       game_sock.send(
//         JSON.stringify({
//           type: "score",
//           p1: scores[0],
//           p2: scores[1],
//         }),
//       );
//       if (interval) clearInterval(interval);
//     } else {
//       state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p2_height);
//     }
//   }
// }

/**
 * @param {GameState} state
 * @returns {void}
 * INFO: MODIFIES STATE
 */
function tick_multiplayer_death_processing(state) {
  /** @type {number} */
  let death = detect_death(state);

  if (death) state.ball_speed_x = 0;
  if (death && player_num == death) {
    scores[death % 2] += 1;
    if (interval) clearInterval(interval);
    game_sock.send(
      JSON.stringify({
        type: "score",
        p1: scores[0],
        p2: scores[1],
      }),
    );
  }
}

/**
	* @param {GameState} state
	* @param {vec2} input
	* @returns {GameState}
	//INFO: takes a state and an input, simulates the next state and returns it
*/
function multiplayer_tick(state, input) {
  let ret = Object.assign({}, state);

  ret.frame = state.frame + 1;

  tick_move_paddle(ret, input);
  tick_move_ball(ret, input);
  tick_bounce_vertical(ret, input);
  tick_bounce_horizontal(ret, input);
  //shared bounce method
  // multiplayer_tick_bounce_horizontal(ret, input);
  tick_multiplayer_death_processing(ret);

  return ret;
}

/**
 * @returns {void}
 */
export function multiplayer_update() {
  // go forward
  current_frame += 1;

  // process local input
  if (inputs.length <= current_frame) {
    inputs[current_frame] = [undefined, undefined];
  }
  if (keys.has("ArrowUp") || keys.has("KeyW")) {
    inputs[current_frame][player_num - 1] = -1;
  } else if (keys.has("ArrowDown") || keys.has("KeyS")) {
    inputs[current_frame][player_num - 1] = 1;
  } else {
    inputs[current_frame][player_num - 1] = 0;
  }

  //send input
  game_sock.send(
    JSON.stringify({
      type: "input",
      frame: current_frame,
      input: inputs[current_frame][player_num - 1],
      player: player_num,
    }),
  );

  // zip to last processed frame and recalculate until now
  // assume input is same for every frame since last input received before the calculated instance
  // looks incorrect
  let validating = true;
  let frame_input_count = 0;
  copy_gamestate(last_processed_state, current_state);
  let input = [
    // TODO: check off by one (it works doe)
    inputs[current_state.frame][0],
    inputs[current_state.frame][1],
  ];
  while (current_state.frame < current_frame) {
    frame_input_count = 0;
    copy_gamestate(multiplayer_tick(current_state, input), current_state);
    if (inputs[current_state.frame][0] != undefined) {
      input[0] = inputs[current_state.frame][0];
      frame_input_count += 1;
    }
    if (inputs[current_state.frame][1] != undefined) {
      input[1] = inputs[current_state.frame][1];
      frame_input_count += 1;
    }
    if (validating && frame_input_count == 2) {
      last_processed_state = Object.assign({}, current_state);
      last_processed_frame = last_processed_state.frame;
    } else {
      validating = false;
    }
  }
  draw(current_state, scores);
  // create array of size 3
  // if array less than size 3 append to array
  // if array size 3 shift left and set input to pos 3
  // render position 1?
  //TODO: save 3 frame buffer and render a bit late
  // create an array of size 3 and save during while loop at the right place
  // only draw if array is of size 3
}

export function multiplayer_init() {
  init();
  current_frame = 0;
  last_processed_frame = 0;
  last_processed_state = Object.assign({}, current_state);
}

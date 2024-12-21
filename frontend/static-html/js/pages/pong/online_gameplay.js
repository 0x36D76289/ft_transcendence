//@ts-check

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

/** @type {1 | 2} */
var player_num;

/**
 * @param {number} n
 * @returns {void}
 */
export function set_player_num(n) {
  player_num = n | 0;
}

/**
 * @param {GameState} state
 * @returns {void}
 * INFO: MODIFIES STATE
 */
function tick_multiplayer_death_processing(state) {
  /** @type {number} */
  let death = detect_death(state);

  if (death) {
    state.ball_speed_x = 0;
    state.ball_speed_y = 0;
  }
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
	* @param {[input, input]} input
	* @returns {GameState}
	// INFO: takes a state and an input, simulates the next state and returns it
*/
function multiplayer_tick(state, input) {
  let ret = Object.assign({}, state);

  ret.frame = state.frame + 1;

  tick_move_paddle(ret, input);
  tick_move_ball(ret, input);
  tick_bounce_vertical(ret, input);
  tick_bounce_horizontal(ret, input);
  tick_multiplayer_death_processing(ret);

  return ret;
}

/** @type {number} */ const MAX_ROLLBACK_FRAMES = 10 | 0;
/** @type {number} */ const FRAME_ADVANTAGE_LIMIT = 10 | 0;
/** @type {number} */ const INITIAL_FRAME = 0 | 0;
/** @type {number} */ const INPUT_DELAY = 3 | 0;

/** @type {number} */ var local_frame;
/** @type {number} */ var remote_frame;
/** @type {number} */ var remote_frame_advantage;
/** @type {number} */ var sync_frame;
// Tracks the last frame where we synchronized the game state with the remote client.
// Never rollback before this frame. V

/** @type {Array<input>} */ var local_inputs = [];
/** @type {Array<input | undefined>} */ var remote_inputs = [];

/** @type {GameState[]} */ var states = [];

/** @type {1 | 2} */ var player_num;

export function multiplayer_init() {
  local_frame = INITIAL_FRAME;
  remote_frame = INITIAL_FRAME;
  sync_frame = INITIAL_FRAME;
  remote_frame_advantage = 0 | 0;
  local_inputs = [0];
  remote_inputs = [0];
  init();
  states = [];
  states[0] = Object.assign({}, current_state);
}

function update_inputs() {
  /** @type {number} */ let i = sync_frame + 1;
  /** @type {input | undefined} */ let enemy_input;
  while (i <= local_frame) {
    inputs[i] = [0, 0];
    inputs[i][player_num - 1] = local_inputs[i];
    enemy_input = remote_inputs[i];
    if (enemy_input !== undefined) inputs[i][2 - player_num] = enemy_input;
    else inputs[i][2 - player_num] = inputs[i - 1][2 - player_num];
    i++;
  }
}

/** @returns {boolean} */
function is_rollback_condition() {
  return local_frame > sync_frame && remote_frame > sync_frame;
}

/** @returns {boolean} */
function is_time_synced() {
  let local_frame_advantage = local_frame - remote_frame;
  let frame_advantage_difference =
    local_frame_advantage - remote_frame_advantage;

  return (
    local_frame_advantage < MAX_ROLLBACK_FRAMES &&
    frame_advantage_difference <= FRAME_ADVANTAGE_LIMIT
  );
}

function read_local_input() {
  if (keys.has("ArrowUp") || keys.has("KeyW")) {
    local_inputs[local_frame] = -1;
  } else if (keys.has("ArrowDown") || keys.has("KeyS")) {
    local_inputs[local_frame] = 1;
  } else {
    local_inputs[local_frame] = 0;
  }
}

/** @param {number} frame_advantage */
function send_message(frame_advantage) {
  game_sock.send(
    JSON.stringify(
      /** @type {PongMessage} */ ({
        type: "input",
        frame: local_frame,
        input: local_inputs[local_frame],
        player: player_num,
        frame_advantage: frame_advantage,
      }),
    ),
  );
}

export function multiplayer_update() {
  //     [Update Network]
  {
    let i = sync_frame + 1;
    while (i < remote_inputs.length) {
      if (remote_inputs[i] === undefined) break;
      i += 1;
    }
    remote_frame = i - 1;
  }
  let frame_advantage = (local_frame - remote_frame) | 0;

  let final_frame = remote_frame;
  if (remote_frame > local_frame) final_frame = local_frame;
  {
    let i = sync_frame + 1;
    while (i <= final_frame) {
      if (inputs[i][2 - player_num] != remote_inputs[i]) break;
      i++;
    }
    sync_frame = i - 1;
  }
  if (is_rollback_condition()) {
    update_inputs();
    let i = sync_frame + 1;
    while (i <= local_frame) {
      states[i] = multiplayer_tick(states[i - 1], inputs[i]);
      i++;
    }
  }
  if (is_time_synced()) {
    local_frame += 1;
    read_local_input();
    send_message(frame_advantage);
    update_inputs();
    states[local_frame] = multiplayer_tick(
      states[local_frame - 1],
      inputs[local_frame],
    );
  }
  // draw(states[states.length - 1], scores);
  if (states.length >= INPUT_DELAY)
    draw(states[states.length - INPUT_DELAY], scores);
}

/**
 * @param {PongMessage} messageObject
 * @returns {void}
 */
export function player_read_message(messageObject) {
  if (messageObject.player === player_num) return;
  if (messageObject.frame > local_frame + 60) return;
  remote_frame_advantage = messageObject.frame_advantage;
  remote_inputs[messageObject.frame] = messageObject.input;
}

//@ts-check

import { getToken } from "../../utils/cookies.js";
import { set_queue } from "../home.js";
import { set_page_state, STATES } from "./globals.js";
import { main_menu } from "./main_menu.js";
import { start_online_bot_game } from "./online_bot_game.js";
import {
  multiplayer_init,
  multiplayer_update,
  player_read_message,
  set_player_num,
} from "./online_gameplay.js";
import { changenames } from "./render.js";
import {
  GAME_SETTINGS,
  interval,
  scores,
  start_simulation,
} from "./shared_gameplay.js";

/**
 * @param {string} room_name
 * @returns {string}
 */
function game_url(room_name) {
  return (
    "wss://" +
    window.location.host +
    "/api/ws/pong/" +
    room_name +
    "/" +
    "?token=" +
    getToken()
  );
}

/** @type {WebSocket} */
export var game_sock;

/**
 * @param {Object} object
 * @returns {void}
 */
export function read_room(object) {
  /** @type {string} */
  let room = object.value;
  if (room === "bot") {
    start_online_bot_game();
  }
  if (game_sock !== undefined) game_sock.close();
  game_sock = new WebSocket(game_url(room));
  game_sock.onmessage = game_sock_receive;
  console.log(
    "CONNECTED TO SOCKET SOCKET THAT IS BOT: (",
    room === "bot",
    ") AND IS ",
    game_sock,
  );
  set_queue(false);
}

/**
 * @param {Object} object
 * @returns {void}
 */
function game_sock_receive(object) {
  try {
    let inner = JSON.parse(object.data);
    switch (inner.type) {
      case "end":
        game_sock.close();
        if (interval) clearInterval(interval);
        main_menu();
        break;
      case "player_assign":
        let player_num = inner.value;
        changenames(inner.p1, inner.p2);
        set_player_num(player_num);
        console.log("Assigned to player ", player_num);
        if (player_num == 1 || player_num == 2) {
          scores[0] = 0;
          scores[1] = 0;
          game_sock.send('{"type":"score","p1":0, "p2": 0}');
        }
        break;
      case "score":
        console.log("received score update ", inner);
        set_page_state(STATES.MP_Game);
        scores[0] = inner.p1;
        scores[1] = inner.p2;
        if (interval) clearInterval(interval);
        if (
          scores[0] == GAME_SETTINGS.win_score ||
          scores[1] == GAME_SETTINGS.win_score
        ) {
          main_menu();
        } else {
          multiplayer_init();
          start_simulation(multiplayer_update);
        }
        break;
      case "input":
        player_read_message(inner);
        break;
      default:
        console.log("[game sock] couldn't recognize type: ", inner.type);
    }
  } catch (e) {
    console.log("[game sock] couldn't parse: ", object.data);
    return;
  }
}

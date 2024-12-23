//@ts-check

import { send_to_online_sock } from "../../api/socket.js";
import { i18n } from "../../services/i18n.js";
import { in_queue } from "../home.js";
import { init_globals, page_state, STATES } from "./globals.js";
import { keys, onkeydown, onkeyup } from "./input.js";
import { main_menu } from "./main_menu.js";
import { interval } from "./shared_gameplay.js";
import { game_sock, read_room } from "./socket.js";
import { online_layout, offline_layout } from "./layout.js";
import { players, start_name_entry } from "./tournament.js";
import { render_name } from "./render.js";

export function render() {
  return `
  <div class="pong-page">
    <div class="settings-panel" id="settings-container">
      <h3>Game Settings</h3>
    </div>

    <div class="pong-container">
      <div class="game-header">
        <h2 class="game-title">Pong</h2>
        <div class="scores-container">
          <div class="player-score">
            <span class="player-name">Player 1 (W/S)</span>
            <span class="score" id="score1">0</span>
          </div>
          <div class="player-score">
            <span class="player-name">Player 2 (↑/↓)</span>
            <span class="score" id="score2">0</span>
          </div>
        </div>
      </div>

      <div class="game-section">
        <!-- Left Controls -->
        <div class="controls controls-left">
          <button class="control-btn up-btn" id="p1up">
            <span class="material-icons">arrow_upward</span>
          </button>
          <button class="control-btn down-btn" id="p1down">
            <span class="material-icons">arrow_downward</span>
          </button>
        </div>

        <!-- Game Canvas -->
        <div class="game-wrapper">
          <div class="canvas-wrapper">
            <canvas id="game">
              You need a browser that supports HTML5 canvas to play this game.
            </canvas>
          </div>
        </div>

        <!-- Right Controls -->
        <div class="controls controls-right">
          <button class="control-btn up-btn" id="p2up">
            <span class="material-icons">arrow_upward</span>
          </button>
          <button class="control-btn down-btn" id="p2down">
            <span class="material-icons">arrow_downward</span>
          </button>
        </div>
      </div>

      <div class="game-actions" id="bottom-flex">
        <button class="action-btn queue-btn" id="queue-button">
          ${in_queue ? i18n.t("home.leave_mm") : i18n.t("home.join_mm")}
        </button>
        <button class="action-btn tournament-btn" id="local-tournament">
          ${i18n.t("pong.local_tournament")}
        </button>
      </div>
    </div>
  </div>
  `;
}
/**
 * @param {string} buttonname
 * @param {string} keyname
 * @param {Set} keys
 * @returns {void}
 */
function bind_button_to_key(buttonname, keyname, keys) {
  let button = document.getElementById(buttonname);
  if (!button) return;

  button.onpointerenter = () => {
    keys.add(keyname);
  };
  button.onpointerleave = () => {
    keys.delete(keyname);
  };
}

function resize() {
  init_globals();
  switch (page_state) {
    case STATES.Menu:
      main_menu();
      break;
    case STATES.Name_Entry:
      render_name(players);
  }
}

export async function init(options) {
  init_globals();

  bind_button_to_key("p1up", "KeyW", keys);
  bind_button_to_key("p1down", "KeyS", keys);
  bind_button_to_key("p2up", "ArrowUp", keys);
  bind_button_to_key("p2down", "ArrowDown", keys);

  let mm_button = document.getElementById("queue-button");
  if (mm_button) {
    mm_button.onclick = () => {
      send_to_online_sock("join_mm");
    };
  }

  let tournament_button = document.getElementById("local-tournament");
  if (tournament_button) {
    tournament_button.onclick = () => {
      if (page_state === STATES.Name_Entry) return;
      if (page_state === STATES.Scores) return;
      if (interval) clearInterval(interval);
      start_name_entry();
    };
  }

  window.addEventListener("keydown", onkeydown);
  window.addEventListener("keyup", onkeyup);
  window.addEventListener("resize", resize);

  main_menu();

  if (options?.game != undefined) {
    online_layout();
    read_room(options.game);
  } else {
    offline_layout();
  }
}

export async function unload() {
  window.removeEventListener("keydown", onkeydown);
  window.removeEventListener("keyup", onkeyup);
  window.removeEventListener("resize", resize);
  if (interval) clearInterval(interval);
  if (game_sock !== undefined) game_sock.close();
}

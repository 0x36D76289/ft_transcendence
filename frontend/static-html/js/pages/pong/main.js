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
	<div class="page-container" id="pong-fullpage">
        <!-- First Canvas Section -->
        <div class="canvas-layout">

            <!-- Main Canvas -->
			<canvas class="canvas" id="game">
	  			you're not supposed to see this
	  		</canvas>

            <!-- Left Buttons -->
            <div class="button-container left-buttons">
                <button class="control-button" id="p1up">
	  				<span class=material-icons>arrow_upward</span>
	  			</button>
                <button class="control-button" id="p1down">
	  				<span class=material-icons>arrow_downward</span>
	  			</button>
            </div>

            <!-- Right Buttons -->
            <div class="button-container right-buttons">
                <button class="control-button" id="p2up">
	  				<span class=material-icons>arrow_upward</span>
	  			</button>
                <button class="control-button" id="p2down">
	  				<span class=material-icons>arrow_downward</span>
	  			</button>
            </div>

            <!-- Bottom Buttons -->
            <div class="button-container bottom-buttons" id="bottom-flex">
                <button class="pong-nav-button" id="queue-button">
					${in_queue ? i18n.t("notifications.matchmaking.leave") : i18n.t("notifications.matchmaking.join")}
				</button>
                <button type="button" class="pong-nav-button" id="local-tournament">
					${i18n.t("pong.local_tournament")}
				</button>
            </div>
        </div>
	<div class="page_container">
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
  game_sock.close();
}

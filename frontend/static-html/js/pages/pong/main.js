//@ts-check

import { send_to_online_sock } from "../../api/socket.js";
import { i18n } from "../../services/i18n.js";
import { in_queue } from "../home.js";
import { init_globals } from "./globals.js";
import { keys, name_enter } from "./input.js";

export function render() {
  return `
	<div class="page-container">
        <!-- First Canvas Section -->
        <div class="canvas-layout">

            <!-- Main Canvas -->
			<canvas class="canvas" id="game">
	  			you're not supposed to see this
	  		</canvas>

            <!-- Left Buttons -->
            <div class="button-container left-buttons">
                <button class="button" id="p1up">
	  				<span class=material-icons>arrow_upward</span>
	  			</button>
                <button class="button" id="p1down">
	  				<span class=material-icons>arrow_downward</span>
	  			</button>
            </div>

            <!-- Right Buttons -->
            <div class="button-container right-buttons">
                <button class="button" id="p2up">
	  				<span class=material-icons>arrow_upward</span>
	  			</button>
                <button class="button" id="p2down">
	  				<span class=material-icons>arrow_downward</span>
	  			</button>
            </div>

            <!-- Bottom Buttons -->
            <div class="button-container bottom-buttons">
	  			<!--TODO: i18n-->
                <button class="pong-nav-button" id="queue-button">
					${in_queue ? i18n.t("home.leave_mm") : i18n.t("home.join_mm")}
				</button>
                <button class="pong-nav-button" id="local_tournament">
					${i18n.t("tournaments.local")}
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
  /** @type {HTMLButtonElement} */
  let button = document.getElementById(buttonname);
  if (button === undefined) return;

  button.onpointerenter = () => {
    keys.add(keyname);
  };
  button.onpointerleave = () => {
    keys.delete(keyname);
  };
}

/**
 * @param {KeyboardEvent} e
 * @returns {void}
 */
function addkey(e) {
  keys.add(e.code);
  name_enter(e);
}

/**
 * @param {KeyboardEvent} e
 * @returns {void}
 */
function removekey(e) {
  keys.delete(e.code);
}

export async function init(options) {
  const { main_menu } = await import("./main_menu.js");
  const { read_room } = await import("./socket.js");

  init_globals();

  bind_button_to_key("p1up", "KeyW", keys);
  bind_button_to_key("p1down", "KeyS", keys);
  bind_button_to_key("p2up", "ArrowUp", keys);
  bind_button_to_key("p2down", "ArrowDown", keys);

  //TODO: save event listeners so you can close them later

  /** @type {HTMLButtonElement} */
  let mm_button = document.getElementById("queue-button");
  if (mm_button) {
    mm_button.onclick = function () {
      send_to_online_sock("join_mm");
    };
  }

  window.addEventListener("keydown", addkey);
  window.addEventListener("keyup", removekey);
  window.addEventListener("resize", init_globals);

  main_menu();

  if (options?.game != undefined) {
    document.getElementById("profile-preview-overlay")?.remove();
    read_room(options.game);
  }
}

export async function unload() {
  window.removeEventListener("keydown", addkey);
  window.removeEventListener("keyup", removekey);
  window.removeEventListener("resize", init_globals);
}

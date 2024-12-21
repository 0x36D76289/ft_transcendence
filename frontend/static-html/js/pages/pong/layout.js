//@ts-check

import { i18n } from "../../services/i18n.js";
import { GAME_DIMENSIONS } from "./globals.js";
import { GAME_SETTINGS } from "./shared_gameplay.js";

/**
 * @param {String} html - HTML representing a single node (which might be an Element,
                   a text node, or a comment).
 * @return {Node}
 */
function htmlToNode(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const nNodes = template.content.childNodes.length;
  if (nNodes !== 1) {
    console.error(
      `html parameter must represent a single node; got ${nNodes}. ` +
        "Note that leading or trailing spaces around an element in your " +
        'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
        "the element; call .trim() on your input to avoid this.",
    );
  }
  return template.content.firstChild;
}

/** @returns {void} */
export function online_layout() {
  /** @type {?HTMLElement} */
  let bottomFlex = document.getElementById("bottom-flex");
  if (bottomFlex) bottomFlex.style.justifyContent = "center";

  /** @type {?HTMLButtonElement} */
  let tournamentButton = document.getElementById("local-tournament");
  if (tournamentButton) tournamentButton.remove();
}

/**
 * @param {HTMLElement} pageContainer
 * @param {String} paramName
 * @param {number} min
 * @param {number} max
 * @returns {void}
 */
function add_slider(pageContainer, paramName, min, max) {
  /** @type {Node} */
  let node = htmlToNode(
    `<div class="setting-container">` +
      `<label for="pongsetting-${paramName}" id="pongtext-${paramName}">${i18n.t("pong.setting." + paramName)}: </label>` +
      `<input type="range" min=${min} max=${max} class="setting-slider" id="pongsetting-${paramName}">` +
      `<input type="text" readonly size="2" id="pongshow-${paramName}">` +
      `</div>`,
  );
  pageContainer.insertBefore(node, pageContainer.firstChild);
  /** @type {HTMLInputElement} */
  let slider = document.getElementById("pongsetting-" + paramName);
  /** @type {HTMLInputElement} */
  let value = document.getElementById("pongshow-" + paramName);

  slider.value = GAME_SETTINGS[paramName];
  slider.oninput = (_) => {
    value.value = slider.value;
    GAME_SETTINGS[paramName] = slider.value | 0;
  };
  slider.onwheel = (ev) => {
    let val = slider.value | 0;
    if (ev.deltaY > 0) {
      slider.value = val - 1;
    } else if (ev.deltaY < 0) {
      slider.value = val + 1;
    }
    slider.oninput();
  };
  slider.oninput();
}

/** @returns {void} */
export function offline_layout() {
  /** @type {?HTMLElement} */
  let pageContainer = document.getElementById("pong-fullpage");
  if (!pageContainer) return;

  add_slider(pageContainer, "paddle_width", 1, (GAME_DIMENSIONS[0] / 4) | 0);
  add_slider(pageContainer, "paddle_height", 1, (GAME_DIMENSIONS[1] / 2) | 0);
  add_slider(pageContainer, "paddle_speed", 0, (GAME_DIMENSIONS[1] / 10) | 0);
  add_slider(pageContainer, "ball_size", 1, 30);
  add_slider(pageContainer, "ball_speed", 1, 10);
  add_slider(pageContainer, "ball_y_speed_factor", 1, 20);
  add_slider(pageContainer, "win_score", 1, 100);
}

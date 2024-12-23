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

  let p1c = document.getElementById("p1controls");
  let p2c = document.getElementById("p2controls");
  let settingsContainer = document.getElementById("settings-container");

  if (p1c) p1c.remove();
  if (p2c) p2c.remove();
  if (settingsContainer) settingsContainer.remove();
}

/**
 * @param {String} paramName
 * @param {number} min
 * @param {number} max
 * @returns {void}
 */
function add_slider(paramName, min, max) {
  const settingsContainer = document.getElementById("settings-container");
  if (!settingsContainer) return;

  // Create the HTML for the slider
  const sliderHTML = `
    <div class="setting-container">
      <label for="pongsetting-${paramName}">${i18n.t("pong.setting." + paramName)}</label>
      <input type="range"
             min="${min}"
             max="${max}"
             class="setting-slider"
             id="pongsetting-${paramName}">
      <input type="text"
             readonly
             class="setting-value"
             id="pongshow-${paramName}">
    </div>
  `;

  // Add the slider to the container
  settingsContainer.insertAdjacentHTML("beforeend", sliderHTML);

  // Set up the slider functionality
  const slider = document.getElementById("pongsetting-" + paramName);
  const value = document.getElementById("pongshow-" + paramName);

  if (slider && value) {
    slider.value = GAME_SETTINGS[paramName];

    slider.oninput = () => {
      value.value = slider.value;
      GAME_SETTINGS[paramName] = parseInt(slider.value);
    };

    slider.onwheel = (ev) => {
      ev.preventDefault();
      const val = parseInt(slider.value);
      if (ev.deltaY > 0 && val > min) {
        slider.value = val - 1;
      } else if (ev.deltaY < 0 && val < max) {
        slider.value = val + 1;
      }
      slider.oninput();
    };

    // Initial value set
    slider.oninput();
  }
}

/** @returns {void} */
export function offline_layout() {
  // Add title to settings panel if needed
  const settingsContainer = document.getElementById("settings-container");
  if (settingsContainer) {
    if (!settingsContainer.querySelector("h3")) {
      settingsContainer.insertAdjacentHTML(
        "afterbegin",
        "<h3>Game Settings</h3>",
      );
    }
  }

  // Add all sliders
  add_slider("paddle_width", 1, Math.floor(GAME_DIMENSIONS[0] / 4));
  add_slider("paddle_height", 1, Math.floor(GAME_DIMENSIONS[1] / 2));
  add_slider("paddle_speed", 0, Math.floor(GAME_DIMENSIONS[1] / 10));
  add_slider("ball_size", 1, 30);
  add_slider("ball_speed", 1, 10);
  add_slider("ball_y_speed_factor", 1, 20);
  add_slider("win_score", 1, 100);
}

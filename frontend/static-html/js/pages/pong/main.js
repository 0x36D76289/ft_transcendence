//@ts-check

import { send_to_online_sock } from "../../api/socket.js";
import { popupSystem } from "../../services/popup.js";

export function render() {
  return (
    //    `
    // 	<div class="hflex">
    // 		<canvas class="game" id="game" width="600px" height="450px">you're not supposed to see this</canvas>
    // 		<div class="vflex">
    // 			<button type="button" class="pong_nav_button" id="matchmaking">Join Matchmaking</button>
    // 			<div class="spacer"></div>
    // 			<!--button type="button" class="pong_nav_button">Join Tournament?</button-->
    // 		</div>
    // 	</div>
    // ` +
    `
	<div class="page-container">
        <!-- First Canvas Section -->
        <div class="canvas-layout">

            <!-- Main Canvas -->
			<canvas class="canvas" id="game">
	  			you're not supposed to see this
	  		</canvas>

            <!-- Left Buttons -->
            <div class="button-container left-buttons">
                <button class="button">Button B</button>
                <button class="button">Button C</button>
            </div>
            <!-- Right Buttons -->
            <div class="button-container right-buttons">
                <button class="button">Button A</button>
                <button class="button">Button B</button>
            </div>
            <!-- Bottom Buttons -->
            <div class="button-container bottom-buttons">
                <button class="button" id="matchmaking">Button 1</button>
                <button class="button">Button 2</button>
            </div>
        </div>
	<div class="page_container">
	`
  );
}

export async function init(options) {
  const { name_enter, keys } = await import("./input.js");
  const { main_menu } = await import("./main_menu.js");
  const { init_globals } = await import("./globals.js");
  const { read_room } = await import("./socket.js");

  init_globals();
  //TODO: save event listeners so you can close them later

  /** @type {HTMLButtonElement} */
  let mm_button = document.getElementById("matchmaking");
  if (mm_button) {
    mm_button.onclick = function () {
      send_to_online_sock("join_mm");
    };
  }

  mm_button.onpointerenter = () => {
    console.log("entering");
    popupSystem("info", "entering");
  };
  mm_button.onpointerleave = () => {
    console.log("leaving");
    popupSystem("info", "leaving");
  };

  window.addEventListener("keydown", function (e) {
    keys.add(e.code);
    name_enter(e);
  });
  window.addEventListener("keyup", function (e) {
    keys.delete(e.code);
  });
  window.addEventListener("resize", init_globals);

  main_menu();

  if (options?.game != undefined) {
    document.getElementById("profile-preview-overlay")?.remove();
    read_room(options.game);
  }
}

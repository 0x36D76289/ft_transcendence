import { start, addRoute } from "./spa.js";
import { renderHome } from "./pages/home.js";
import { renderAccount } from "./pages/account.js";
import { renderPlay } from "./pages/play.js";
import { renderPacman } from "./pages/games/pacman.js";

// entry point
document.addEventListener("DOMContentLoaded", () => {
  addRoute("/", renderHome);
  addRoute("/account", renderAccount);
  addRoute("/play", renderPlay);
  addRoute("/pacman", renderPacman);

  start();
});

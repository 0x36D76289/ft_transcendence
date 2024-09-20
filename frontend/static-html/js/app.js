import { start, addRoute } from "./spa.js";
import { renderHome } from "./pages/home.js";
import { renderProfile } from "./pages/account/profile.js";
import { renderHub } from "./pages/hub.js";
import { renderPacman } from "./pages/games/pacman.js";
import { renderConnexion } from "./pages/account/connexion.js";

export let currentUser = null;

// entry point
document.addEventListener("DOMContentLoaded", () => {
  addRoute("/", renderHome);
  addRoute("/hub", renderHub);

  addRoute("/profile", renderProfile);
  addRoute("/connexion", renderConnexion);

  addRoute("/pacman", renderPacman);

  flashlight();
  start();
});

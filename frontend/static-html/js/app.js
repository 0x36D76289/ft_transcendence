import { start, addRoute } from "./spa.js";
import { renderHome } from "./pages/home.js";
import { renderProfile } from "./pages/account/profile.js";
import { renderHub } from "./pages/hub.js";
import { renderPacman } from "./pages/games/pacman.js";
import { renderLogin } from "./pages/account/login.js";

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  // Routes
  addRoute("/", renderHome);
  addRoute("/home", renderHome);
  addRoute("/hub", renderHub);

  addRoute("/profile", renderProfile);
  addRoute("/login", renderLogin);

  // Game pages
  addRoute("/game", renderPacman);
  addRoute("/pacman", renderPacman);

  start();
});

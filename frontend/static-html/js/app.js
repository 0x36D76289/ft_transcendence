import { start, addRoute } from "./spa.js";
import { renderHome } from "./pages/home.js";
import { renderProfile } from "./pages/account/profile.js";
import { renderHub } from "./pages/hub.js";
import { renderPacman } from "./pages/games/pacman.js";
import { renderLogin } from "./pages/account/login.js";
import { readCookie } from "./cookie.js";

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  // Routes
  addRoute("/home", renderHome);
  addRoute("/hub", renderHub);

  // Account pages
  if (readCookie("authToken")) {
    currentUser = await getUserProfile(readCookie("authToken"));
    addRoute("/account/profile", renderProfile);
  } else {
    addRoute("/account/login", renderLogin);
  }

  addRoute("/account/login", renderLogin);

  // Game pages
  addRoute("/game", renderPacman);
  addRoute("/game/pacman", renderPacman);

  start();
});

import { start } from "./spa.js";
import { addRoute } from "./spa.js";

import { renderHome } from "./pages/home.js";
import { renderPlay } from "./pages/play.js";
import { renderAccount } from "./pages/account.js";

// entry point
document.addEventListener("DOMContentLoaded", () => {
  addRoute("/", renderHome);
  addRoute("/play", renderPlay);
  addRoute("/account", renderAccount);

  start();
});

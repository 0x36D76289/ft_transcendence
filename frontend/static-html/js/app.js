import { start, addRoute } from "./spa.js";

import { renderHome } from "./pages/home.js";
import { renderAccount } from "./pages/account.js";

// entry point
document.addEventListener("DOMContentLoaded", () => {
  addRoute("/", renderHome);
  addRoute("/account", renderAccount);

  start();
});

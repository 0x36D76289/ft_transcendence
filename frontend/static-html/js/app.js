import { start, addRoute, navigate } from "./spa.js";
import { friends } from "./pages/friends.js";
import { login } from "./pages/login.js";
import { hub } from "./pages/hub.js";

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  addRoute("/", hub);
  addRoute("/login", login);
  addRoute("/friends", friends);
  start();
});

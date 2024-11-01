import { start, addRoute } from "./spa.js";
import { friends } from "./pages/friends.js";
import { login } from "./pages/login.js";
import { hub } from "./pages/hub.js";
import { profile } from "./pages/profile.js";
import { pong } from './pages/pong.js'

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  addRoute("/", hub);
  addRoute("/login", login);
  addRoute("/friends", friends);
  addRoute("/profile", profile);
  addRoute("/pong", pong);

  start();
});

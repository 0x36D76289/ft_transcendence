import { start, addRoute, navigate } from "./spa.js";
import { readCookie } from "./cookie.js";
import { login } from "./pages/login.js";
import { hub } from "./pages/hub.js";

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  addRoute("/", hub);
  addRoute("/login", login);
  start();

  // if (readCookie("token") === null) {
  //   navigate("/login");
  // }
});

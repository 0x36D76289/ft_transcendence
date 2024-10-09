import { start, addRoute, navigate } from "./spa.js";
import { friends } from "./pages/friends.js";
import { login } from "./pages/login.js";
import { hub } from "./pages/hub.js";
import { profile } from "./pages/profile.js";
import { createCookie, readCookie } from "./cookie.js";
import { createGuest, isTokenValid } from "./api/user.js";

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  addRoute("/", hub);
  addRoute("/login", login);
  addRoute("/friends", friends);
  addRoute("/profile", profile);

  start();

  if (readCookie("token") === null) {
    await createGuest();
  } else {
    const response = await isTokenValid();

    if (!response.username) {
      await createGuest();
    }
  }
});

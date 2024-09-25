import { start, addRoute } from "./spa.js";
import { readCookie } from "./cookie.js";
import { renderHome } from "./pages/home.js";
import { renderLogin } from "./pages/account/login.js";
import { renderProfile } from "./pages/account/profile.js";
import { renderHub } from "./pages/hub.js";
import { generateMultipleProfiles } from "./profile_generator.js";

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  addRoute("/", renderHome);
  addRoute("/home", renderHome);
  addRoute("/login", renderLogin);

  const username = readCookie("username");
  if (readCookie("authToken") && username) {
    addRoute(`/${username}`, () => renderProfile(username));
    addRoute("/hub", renderHub);
  }

    // Call functions
  generateMultipleProfiles(50); // Call this to generate profiles
  // deleteMultipleProfiles(); // Call this to delete profiles

  start();
});

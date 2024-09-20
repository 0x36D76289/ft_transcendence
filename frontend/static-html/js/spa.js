import { logMessage } from "./logs.js";
import { getData } from "./api/utils.js";

let routes = {};

export function addRoute(path, handler) {
  logMessage(`Adding route for ${path}`, "info");
  routes[path] = handler;
}

export function removeRoute(path) {
  logMessage(`Removing route for ${path}`, "info");
  delete routes[path];
}

export function navigate(path, pushState = true) {
  if (routes[path]) {
    logMessage(`Navigating to ${path}`, "info");

    // Remove all CSS
    document.querySelectorAll("style").forEach((style) => style.remove());

    // Remove all HTML
    document.body.innerHTML = "";

    routes[path]();

    if (pushState) {
      window.history.pushState({ path }, "", path);
    }
  } else {
    logMessage(`Route for ${path} not found`, "error");
    navigate("/", pushState);
  }
}

function handlePopState(event) {
  const path = event.state?.path || "/";
  logMessage(`Handling popstate for ${path}`, "info");
  navigate(path, false);
}

export function start() {
  logMessage("Starting SPA", "info");

  const initialPath = window.location.pathname;
  navigate(initialPath, false);

  window.addEventListener("popstate", handlePopState);
}

export const checkAuthStatus = async () => {
  const response = await getData("/auth/status/");
  if (response.is_authenticated) {
    return response.user;
  }
  return null;
};

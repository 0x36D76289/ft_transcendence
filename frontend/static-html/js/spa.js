import { logMessage } from "./logs.js";

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

    const styles = document.head.querySelectorAll("style");
    styles.forEach((style) => style.remove());
    const app = document.getElementById("app");
    app.innerHTML = "";

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

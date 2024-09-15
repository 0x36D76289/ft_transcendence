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

export function navigate(path) {
  if (routes[path]) {
    logMessage(`Navigating to ${path}`, "info");
    const styles = document.head.querySelectorAll("style");
    styles.forEach((style) => style.remove());
    const app = document.getElementById("app");
    app.innerHTML = "";

    routes[path]();
  } else {
    logMessage(`Route for ${path} not found`, "error");
    navigate("/");
  }
}

export function start() {
  window.addEventListener("hashchange", () => {
    logMessage(`Hash changed to ${window.location.hash}`, "info");
    navigate(window.location.hash.substring(1));
  });

  if (window.location.hash) {
    logMessage(`Navigating to ${window.location.hash.substring(1)}`, "info");
    navigate(window.location.hash.substring(1));
  } else {
    logMessage("No hash found, navigating to /", "info");
    navigate("/");
  }
}

import { getData } from "./api/utils.js";

let routes = {};

export function addRoute(path, handler) {
  console.log(`Adding route for ${path}`);
  routes[path] = handler;
}

export function removeRoute(path) {
  console.log(`Removing route for ${path}`);
  delete routes[path];
}

export function navigate(path, pushState = true) {
  if (routes[path]) {
    console.log(`Navigating to ${path}`);

    // Remove all CSS
    document.querySelectorAll("style").forEach((style) => style.remove());

    // Remove all HTML
    document.body.innerHTML = "";

    routes[path]();

    if (pushState) {
      window.history.pushState({ path }, "", path);
    }
  } else {
    console.log(`Route for ${path} not found`);
    navigate("/home", pushState);
  }
}

// function handlePopState(event) {
//   const path = event.state?.path || "/";
//   console.log(`Pop state: ${path}`);
//   navigate(path, false);
// }

export function start() {
  console.log("Starting SPA");

  const initialPath = window.location.pathname;
  navigate(initialPath, false);

  // window.addEventListener("popstate", handlePopState);
}
